@description('The Azure region where the MySQL Flexible Server will be deployed.')
param location string

@description('The ID of the Log Analytics Workspace.')
param logAnalyticsWorkspaceId string

@description('The ID of the Virtual Network.')
param virtualNetworkId string

@description('The ID of the delegated subnet.')
param delegatedSubnetId string

@description('The name of the MySQL Flexible Server.')
param name string

@description('The SKU name of the MySQL Flexible Server.')
param skuName string = 'Standard_B1ms'

@description('The tier of the MySQL Flexible Server.')
param tier string = 'Burstable'

@description('The version of the MySQL Flexible Server.')
param version string = '8.0.21'

@description('The admin username for the MySQL Flexible Server.')
param dbUser string
@secure()
@description('The admin password for the MySQL Flexible Server.')
param dbUserPassword string

@description('The name of the MySQL Database.')
param dbName string

@description('The charset of the MySQL Database.')
param dbCharset string = 'utf8mb4'

@description('The collation of the MySQL Database.')
param dbCollation string = 'utf8mb4_unicode_ci'

@description('Tags to apply to resources')
param tags object

resource privateDnsZone 'Microsoft.Network/privateDnsZones@2024-06-01' = {
  location: 'global'
  tags: tags
  name: '${name}.mysql.database.azure.com'

  resource privateDnsZoneLink 'virtualNetworkLinks' = {
    name: 'vnet-link-${uniqueString(virtualNetworkId)}'
    location: 'global'
    properties: {
      virtualNetwork: {
        id: virtualNetworkId
      }
      registrationEnabled: false
    }
  }
}

resource mysqlServer 'Microsoft.DBforMySQL/flexibleServers@2025-06-01-preview' = {
  dependsOn: [privateDnsZone::privateDnsZoneLink]
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

  resource binlogRowImage 'configurations' = {
    name: 'binlog_row_image'
    properties: {
      value: 'FULL'
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

  resource firewallRule 'firewallRules' = {
    name: 'allow-all-azure-ips'
    properties: {
      startIpAddress: '0.0.0.0'
      endIpAddress: '0.0.0.0'
    }
  }
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

@description('The ID of the MySQL Flexible Server.')
output id string = mysqlServer.id
@description('The name of the MySQL Flexible Server.')
output name string = mysqlServer.name
@description('The FQDN of the MySQL Flexible Server.')
output fqdn string = mysqlServer.properties.fullyQualifiedDomainName
@description('The port of the MySQL Flexible Server.')
output port int = mysqlServer.properties.databasePort
@description('The name of the MySQL Database.')
output database string = mysqlServer::mysqlDatabase.name
