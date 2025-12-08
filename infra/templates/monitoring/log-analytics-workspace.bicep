param location string
@minLength(3)
param name string
param retentionInDays int = 30

@description('Tags to apply to resources')
param tags object

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2025-07-01' = {
  location: location
  name: '${name}-${location}'
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: retentionInDays
  }
  tags: tags
}

output id string = logAnalyticsWorkspace.id
output name string = logAnalyticsWorkspace.name
output customerId string = logAnalyticsWorkspace.properties.customerId
@secure()
output primarySharedKey string = logAnalyticsWorkspace.listKeys().primarySharedKey
