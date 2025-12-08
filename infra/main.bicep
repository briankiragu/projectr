param location string = resourceGroup().location

// Monitoring & Logging
param logAnalyticsWorkspaceName string

// Security & Identity
param managedIdentityName string
param keyVaultName string

// Networking
param publicIpName string
param natGatewayName string
param vnetName string

// Storage
param storageAccountName string

// Database
param sqlServerName string
param mySQLDBName string
param mySQLDBUser string
@secure()
param mySQLDBUserPassword string

// Caching
param redisCacheName string

// Compute
param containerAppEnvName string
param containerAppName string

// Application Secrets
@secure()
param meiliMasterKey string

@secure()
param directusKey string
@secure()
param directusSecret string

param directusAdminEmail string
@secure()
param directusAdminPassword string

param tags object

// ========================================================================
// Monitoring
// ========================================================================
module logAnalyticsWorkspace 'templates/monitoring/log-analytics-workspace.bicep' = {
  name: 'logAnalytics'
  params: {
    location: location
    name: logAnalyticsWorkspaceName
    tags: tags
  }
}

// ========================================================================
// Security
// ========================================================================
module managedIdentity 'templates/security/managed-identity.bicep' = {
  name: 'managedIdentity'
  params: {
    location: location
    name: managedIdentityName
    tags: tags
  }
}

module keyVault 'templates/security/key-vault.bicep' = {
  name: 'keyVault'
  params: {
    location: location
    name: keyVaultName
    logAnalyticsWorkspaceId: logAnalyticsWorkspace.outputs.id
    managedIdentityPrincipalId: managedIdentity.outputs.principalId
    tags: tags
  }
}

// ========================================================================
// Networking
// ========================================================================
module natGateway 'templates/networking/nat-gateway.bicep' = {
  name: 'natGateway'
  params: {
    location: location
    publicIpName: publicIpName
    natGatewayName: natGatewayName
    tags: tags
  }
}

module virtualNetwork 'templates/networking/virtual-network.bicep' = {
  name: 'vnet'
  params: {
    location: location
    name: vnetName
    addressPrefix: '10.0.0.0/16'
    subnets: [
      {
        name: 'mysql-subnet'
        addressPrefix: '10.0.0.0/23'
        natGateway: null
        delegations: [
          {
            name: 'sql-flexible-delegation'
            properties: {
              serviceName: 'Microsoft.DBforMySQL/flexibleServers'
            }
          }
        ]
      }
      {
        name: 'aca-subnet'
        addressPrefix: '10.0.0.0/24'
        natGateway: {
          id: natGateway.outputs.id
        }
        delegations: [
          {
            name: 'aca-delegation'
            properties: {
              serviceName: 'Microsoft.App/environments'
            }
          }
        ]
      }
    ]
    tags: tags
  }
}

// ========================================================================
// Storage
// ========================================================================
module storage 'templates/storage/storage-account.bicep' = {
  name: 'storage'
  params: {
    location: location
    name: storageAccountName
    logAnalyticsWorkspaceId: logAnalyticsWorkspace.outputs.id
    tags: tags
  }
}

// ========================================================================
// Database
// ========================================================================
module mysql 'templates/storage/mysql-flexible.bicep' = {
  name: 'mysql'
  params: {
    location: location
    name: sqlServerName
    logAnalyticsWorkspaceId: logAnalyticsWorkspace.outputs.id
    virtualNetworkId: virtualNetwork.outputs.id
    delegatedSubnetId: virtualNetwork.outputs.subnetIds[0] // mysql-subnet
    dbUser: mySQLDBUser
    dbUserPassword: mySQLDBUserPassword
    dbName: mySQLDBName
    tags: tags
  }
}

// =======================================================================
// Caching
// ========================================================================
module redis 'templates/storage/redis-cache.bicep' = {
  name: 'redis'
  params: {
    location: location
    name: redisCacheName
    logAnalyticsWorkspaceId: logAnalyticsWorkspace.outputs.id
    tags: tags
  }
}

// ========================================================================
// Compute (Environment)
// ========================================================================
module containerAppEnv 'templates/compute/container-app-env.bicep' = {
  name: 'aca-env'
  params: {
    location: location
    name: containerAppEnvName
    logAnalyticsCustomerId: logAnalyticsWorkspace.outputs.customerId
    logAnalyticsSharedKey: logAnalyticsWorkspace.outputs.primarySharedKey
    logAnalyticsWorkspaceId: logAnalyticsWorkspace.outputs.id
    infrastructureSubnetId: virtualNetwork.outputs.subnetIds[1] // aca-subnet
    storageAccountName: storage.outputs.name
    storageAccountKey: storage.outputs.primaryKey
    tags: tags
  }
}

// ========================================================================
// Compute (Apps)
// ========================================================================
module meilisearch 'templates/compute/container-app.bicep' = {
  name: 'meilisearch'
  params: {
    location: location
    name: '${containerAppName}-meilisearch'
    logAnalyticsWorkspaceId: logAnalyticsWorkspace.outputs.id
    userAssignedIdentityId: managedIdentity.outputs.id
    containerAppEnvironmentId: containerAppEnv.outputs.id
    image: 'getmeili/meilisearch:latest'
    externalIngress: true
    targetPort: 7700
    secrets: [
      { name: 'master-key', value: meiliMasterKey }
    ]
    env: [
      { name: 'MEILI_ENV', value: 'production' }
      { name: 'MEILI_MASTER_KEY', secretRef: 'master-key' }
    ]
    volumeMounts: [
      { volumeName: 'meili-data', mountPath: '/meili_data' }
    ]
    volumes: [
      {
        name: 'meili-data'
        storageType: 'AzureFile'
        storageName: storageAccountName
      }
    ]
    tags: tags
  }
}

module directus 'templates/compute/container-app.bicep' = {
  name: 'directus'
  params: {
    location: location
    name: '${containerAppName}-directus'
    logAnalyticsWorkspaceId: logAnalyticsWorkspace.outputs.id
    userAssignedIdentityId: managedIdentity.outputs.id
    containerAppEnvironmentId: containerAppEnv.outputs.id
    image: 'directus/directus:11.5.1'
    externalIngress: true
    targetPort: 8055
    secrets: [
      { name: 'db-password', value: mySQLDBUserPassword }
      { name: 'redis-key', value: redis.outputs.primaryKey }
      { name: 'key', value: directusKey }
      { name: 'secret', value: directusSecret }
      { name: 'admin-password', value: directusAdminPassword }
    ]
    env: [
      { name: 'DB_CLIENT', value: 'mysql' }
      { name: 'DB_HOST', value: mysql.outputs.fqdn }
      { name: 'DB_PORT', value: mysql.outputs.port }
      { name: 'DB_USER', value: mySQLDBUser }
      { name: 'DB_PASSWORD', secretRef: 'db-password' }
      { name: 'DB_DATABASE', value: mySQLDBName }
      { name: 'REDIS_HOST', value: redis.outputs.hostName }
      { name: 'REDIS_PORT', value: redis.outputs.port }
      { name: 'CACHE_ENABLED', value: 'true' }
      { name: 'CACHE_STORE', value: 'redis' }
      { name: 'CACHE_REDIS_TLS', value: 'true' } // Important for Azure Redis
      { name: 'CACHE_REDIS_PASSWORD', secretRef: 'redis-key' }
      { name: 'KEY', secretRef: 'key' }
      { name: 'SECRET', secretRef: 'secret' }
      { name: 'ADMIN_EMAIL', value: directusAdminEmail }
      { name: 'ADMIN_PASSWORD', secretRef: 'admin-password' }
      { name: 'WEBSOCKETS_ENABLED', value: 'true' }
    ]
    volumeMounts: [
      { volumeName: 'directus-data', mountPath: '/directus' }
    ]
    volumes: [
      {
        name: 'directus-data'
        storageType: 'AzureFile'
        storageName: storageAccountName
      }
    ]
    tags: tags
  }
}

module meilisync 'templates/compute/container-app.bicep' = {
  name: 'meilisync'
  params: {
    location: location
    name: '${containerAppName}-meilisync'
    logAnalyticsWorkspaceId: logAnalyticsWorkspace.outputs.id
    userAssignedIdentityId: managedIdentity.outputs.id
    containerAppEnvironmentId: containerAppEnv.outputs.id
    image: 'long2ice/meilisync:latest'
    volumeMounts: [
      { volumeName: 'meilisync-data', mountPath: '/meilisync' }
    ]
    volumes: [
      {
        name: 'meilisync-data'
        storageType: 'AzureFile'
        storageName: storageAccountName
      }
    ]
    tags: tags
  }
}

module meilisyncAdmin 'templates/compute/container-app.bicep' = {
  name: 'meilisync-admin'
  params: {
    location: location
    name: '${containerAppName}-meilisync-admin'
    logAnalyticsWorkspaceId: logAnalyticsWorkspace.outputs.id
    userAssignedIdentityId: managedIdentity.outputs.id
    containerAppEnvironmentId: containerAppEnv.outputs.id
    image: 'ghcr.io/long2ice/meilisync-admin/meilisync-admin'
    externalIngress: true
    targetPort: 8000
    secrets: [
      { name: 'db-password', value: mySQLDBUserPassword }
      { name: 'redis-key', value: redis.outputs.primaryKey }
      { name: 'secret-key', value: meiliMasterKey }
    ]
    env: [
      {
        name: 'REDIS_URL'
        value: 'rediss://:${redis.outputs.primaryKey}@${redis.outputs.hostName}:${redis.outputs.port}/0'
      } // Note: rediss:// for SSL
      {
        name: 'DB_URL'
        value: 'mysql://${mySQLDBUser}:${mySQLDBUserPassword}@${mysql.outputs.fqdn}:${mysql.outputs.port}/${mySQLDBName}'
      }
      { name: 'SECRET_KEY', secretRef: 'secret-key' }
    ]
    tags: tags
  }
}
