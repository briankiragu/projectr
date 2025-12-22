@description('The Azure region where the Container Apps Environment will be deployed.')
param location string

@description('The name of the Container Apps Environment.')
param name string

@description('The ID of the Log Analytics Workspace.')
param logAnalyticsWorkspaceId string

@secure()
@description('The Customer ID of the Log Analytics Workspace.')
param logAnalyticsCustomerId string

@secure()
@description('The Shared Key of the Log Analytics Workspace.')
param logAnalyticsSharedKey string

@description('The ID of the subnet where the Container Apps Environment will be deployed.')
param infrastructureSubnetId string

@description('The name of the Storage Account to mount.')
param storageAccountName string
@secure()
@description('The key of the Storage Account to mount.')
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

@description('The ID of the Container Apps Environment.')
output id string = containerAppEnv.id

@description('The default domain of the Container Apps Environment.')
output defaultDomain string = containerAppEnv.properties.defaultDomain
