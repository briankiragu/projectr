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

@description('Azure File share configurations to register as environment storages.')
param fileShares array // e.g. [{ name: 'directus-data', shareName: 'directus-data' }, ...]

@description('Tags to apply to resources')
param tags object

resource containerAppEnv 'Microsoft.App/managedEnvironments@2025-10-02-preview' = {
  location: location
  name: '${name}${location}'
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
    workloadProfiles: [
      {
        name: 'Consumption'
        workloadProfileType: 'Consumption'
      }
    ]
  }
  tags: tags
}

// Create a separate storage mount for each Azure File share
resource storageMounts 'Microsoft.App/managedEnvironments/storages@2025-10-02-preview' = [
  for share in fileShares: {
    parent: containerAppEnv
    name: share.name
    properties: {
      azureFile: {
        accountName: storageAccountName
        accountKey: storageAccountKey
        shareName: share.shareName
        accessMode: 'ReadWrite'
      }
    }
  }
]

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
