@description('The Azure region where the Log Analytics Workspace will be deployed.')
param location string

@minLength(3)
@description('The name of the Log Analytics Workspace.')
param name string

@description('The data retention in days.')
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

@description('The ID of the Log Analytics Workspace.')
output id string = logAnalyticsWorkspace.id

@description('The name of the Log Analytics Workspace.')
output name string = logAnalyticsWorkspace.name

@description('The Customer ID of the Log Analytics Workspace.')
output customerId string = logAnalyticsWorkspace.properties.customerId

@secure()
@description('The Primary Shared Key of the Log Analytics Workspace.')
output primarySharedKey string = logAnalyticsWorkspace.listKeys().primarySharedKey
