param location string
param name string
param skuName string = 'Basic'
param skuFamily string = 'C'
param skuCapacity int = 0
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
  name: '${name}-diagnostics'
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

output id string = redisCache.id
output name string = redisCache.name
output hostName string = redisCache.properties.hostName
output port int = redisCache.properties.sslPort
@secure()
output primaryKey string = redisCache.listKeys().primaryKey
