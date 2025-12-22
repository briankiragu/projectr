@description('The Azure region where the Redis Cache will be deployed.')
param location string

@description('The name of the Redis Cache.')
param name string

@description('The SKU name of the Redis Cache.')
param skuName string = 'Basic'

@description('The SKU family of the Redis Cache.')
param skuFamily string = 'C'

@description('The SKU capacity of the Redis Cache.')
param skuCapacity int = 0

@description('The ID of the Log Analytics Workspace.')
param logAnalyticsWorkspaceId string

@description('Tags to apply to resources')
param tags object

resource redisCache 'Microsoft.Cache/redis@2024-11-01' = {
  location: location
  name: '${name}-${location}'
  properties: {
    sku: {
      name: skuName
      family: skuFamily
      capacity: skuCapacity
    }
    enableNonSslPort: false // Secure by default
    minimumTlsVersion: '1.2'
  }
  tags: tags
}

resource redisDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: '${redisCache.name}-diagnostics'
  scope: redisCache
  properties: {
    workspaceId: logAnalyticsWorkspaceId
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}

@description('The ID of the Redis Cache.')
output id string = redisCache.id
@description('The name of the Redis Cache.')
output name string = redisCache.name
@description('The host name of the Redis Cache.')
output hostName string = redisCache.properties.hostName
@description('The SSL port of the Redis Cache.')
output port int = redisCache.properties.sslPort
@secure()
@description('The primary key of the Redis Cache.')
output primaryKey string = redisCache.listKeys().primaryKey
