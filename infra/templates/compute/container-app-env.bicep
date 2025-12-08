param location string
param name string

param logAnalyticsWorkspaceId string
@secure()
param logAnalyticsCustomerId string
@secure()
param logAnalyticsSharedKey string

param infrastructureSubnetId string

param storageAccountName string
@secure()
param storageAccountKey string

@description('Tags to apply to resources')
param tags object

resource containerAppEnv 'Microsoft.App/managedEnvironments@2025-10-02-preview' = {
  location: location
  name: '${name}-${location}'
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsCustomerId
        sharedKey: logAnalyticsSharedKey
      }
    }
    vnetConfiguration: {
      infrastructureSubnetId: infrastructureSubnetId
    }
  }
  tags: tags

  // Link Azure Files to the Environment
  resource storageMount 'storages' = {
    name: storageAccountName
    properties: {
      azureFile: {
        accountName: storageAccountName
        accountKey: storageAccountKey
        shareName: 'default' // Placeholder, individual apps specify the share
        accessMode: 'ReadWrite'
      }
    }
  }
}

resource envDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  scope: containerAppEnv
  name: '${containerAppEnv.name}-diagnostics'
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

output id string = containerAppEnv.id
output defaultDomain string = containerAppEnv.properties.defaultDomain
