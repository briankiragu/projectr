param location string
param logAnalyticsWorkspaceId string
param virtualNetworkId string
param delegatedSubnetId string

param name string
param skuName string = 'Standard_B1ms'
param tier string = 'Burstable'
param version string = '8.0.21'

param dbUser string
@secure()
param dbUserPassword string

param dbName string
param dbCharset string = 'utf8mb4'
param dbCollation string = 'utf8mb4_unicode_ci'

@description('Tags to apply to resources')
param tags object

resource privateDnsZone 'Microsoft.Network/privateDnsZones@2024-06-01' = {
  location: location
  tags: tags
  name: '${name}.mysql.database.azure.com'

  resource privateDnsZoneLink 'virtualNetworkLinks' = {
    name: 'virtual-network-link'
    location: location
    properties: {
      virtualNetwork: {
        id: virtualNetworkId
      }
      registrationEnabled: false
    }
  }
}

resource mysqlServer 'Microsoft.DBforMySQL/flexibleServers@2025-06-01-preview' = {
  location: location
  tags: tags
  name: '${name}-${location}'
  sku: {
    name: skuName
    tier: tier
  }
  properties: {
    administratorLogin: dbUser
    administratorLoginPassword: dbUserPassword
    version: version
    network: {
      delegatedSubnetResourceId: delegatedSubnetId
      privateDnsZoneResourceId: privateDnsZone.id
    }
    storage: {
      storageSizeGB: 20
      iops: 360
      autoGrow: 'Enabled'
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
  }

  resource binlogFormat 'configurations' = {
    name: 'binlog_format'
    properties: {
      value: 'ROW'
      source: 'user-override'
    }
  }

  resource mysqlDatabase 'databases' = {
    name: dbName
    properties: {
      charset: dbCharset
      collation: dbCollation
    }
  }

  // resource firewallRule 'firewallRules' = {
  //   name: 'allow-all-azure-ips'
  //   properties: {
  //     startIpAddress: '0.0.0.0'
  //     endIpAddress: '0.0.0.0'
  //   }
  // }
}

resource mysqlDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  scope: mysqlServer
  name: '${mysqlServer.name}-diagnostics'
  properties: {
    workspaceId: logAnalyticsWorkspaceId
    logs: [
      {
        category: 'MySqlSlowLogs'
        enabled: true
      }
      {
        category: 'MySqlAuditLogs'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}

output id string = mysqlServer.id
output name string = mysqlServer.name
output fqdn string = mysqlServer.properties.fullyQualifiedDomainName
output port int = mysqlServer.properties.databasePort
output database string = mysqlServer::mysqlDatabase.name
