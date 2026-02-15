@description('The Azure region where all resources will be deployed.')
param location string = resourceGroup().location

// Monitoring & Logging
@description('The name of the Log Analytics Workspace.')
param logAnalyticsWorkspaceName string

// Security & Identity
@description('The name of the User Assigned Managed Identity.')
param managedIdentityName string

// Networking
@description('The name of the Public IP Address for the NAT Gateway.')
param publicIpName string

@description('The name of the NAT Gateway.')
param natGatewayName string

@description('The name of the Virtual Network.')
param vnetName string

@description('CIDR for the VNet address space. Must match existing VNet if re-deploying to the same name.')
param vnetAddressPrefix string

@description('CIDR for the MySQL delegated subnet. Must not overlap other subnets in the VNet.')
param mysqlSubnetAddressPrefix string

@description('CIDR for the Container Apps Environment subnet. Must not overlap other subnets in the VNet.')
param acaSubnetAddressPrefix string

// Storage
@description('The name of the Storage Account.')
param storageAccountName string

// Database
@description('The name of the MySQL Flexible Server.')
param sqlServerName string

@description('The name of the MySQL Database.')
param sqlDBName string

@secure()
@description('The admin username for the MySQL Flexible Server.')
param sqlDBUser string

@secure()
@description('The admin password for the MySQL Flexible Server.')
param sqlDBUserPassword string

// Caching
@description('The name of the Redis Cache.')
param redisCacheName string

// Compute
@description('The name of the Container Apps Environment.')
param containerAppEnvName string

@description('The base name for the Container Apps.')
param containerAppName string

// Application Secrets
@secure()
@description('The master key for MeiliSearch.')
param meiliMasterKey string

@secure()
@description('The key for Directus.')
param directusKey string

@secure()
@description('The secret for Directus.')
param directusSecret string

@description('The admin email for Directus.')
param directusAdminEmail string

@secure()
@description('The admin password for Directus.')
param directusAdminPassword string

@description('Tags to apply to all resources.')
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
    addressPrefix: vnetAddressPrefix
    subnets: [
      {
        name: 'mysql-subnet'
        addressPrefix: mysqlSubnetAddressPrefix
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
        addressPrefix: acaSubnetAddressPrefix
        natGateway: {
          id: natGateway.outputs.id
        }
        delegations: [
          {
            name: 'Microsoft.App.environments'
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
    dbUser: sqlDBUser
    dbUserPassword: sqlDBUserPassword
    dbName: sqlDBName
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
        storageName: storage.outputs.name
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
      { name: 'db-password', value: sqlDBUserPassword }
      { name: 'redis-key', value: redis.outputs.primaryKey }
      { name: 'key', value: directusKey }
      { name: 'secret', value: directusSecret }
      { name: 'admin-password', value: directusAdminPassword }
    ]
    env: [
      { name: 'DB_CLIENT', value: 'mysql' }
      { name: 'DB_HOST', value: mysql.outputs.fqdn }
      { name: 'DB_PORT', value: mysql.outputs.port }
      { name: 'DB_USER', value: sqlDBUser }
      { name: 'DB_PASSWORD', secretRef: 'db-password' }
      { name: 'DB_DATABASE', value: sqlDBName }
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
        storageName: storage.outputs.name
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
        storageName: storage.outputs.name
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
      { name: 'db-password', value: sqlDBUserPassword }
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
        value: 'mysql://${sqlDBUser}:${sqlDBUserPassword}@${mysql.outputs.fqdn}:${mysql.outputs.port}/${sqlDBName}'
      }
      { name: 'SECRET_KEY', secretRef: 'secret-key' }
    ]
    tags: tags
  }
}
