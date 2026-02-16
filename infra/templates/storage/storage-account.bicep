@description('The Azure region where the Storage Account will be deployed.')
param location string

@description('The name of the Storage Account.')
param name string

@description('The ID of the Log Analytics Workspace.')
param logAnalyticsWorkspaceId string

@description('The names of the Azure File shares to create in the Storage Account.')
param fileShareNames array

@description('Tags to apply to resources')
param tags object

resource storageAccount 'Microsoft.Storage/storageAccounts@2025-06-01' = {
  location: location
  tags: tags
  name: name
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    allowSharedKeyAccess: true // Required for Azure File mounts in Container Apps
    defaultToOAuthAuthentication: true
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    publicNetworkAccess: 'Enabled' // Required for Container Apps to mount Azure File shares
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Allow'
    }
  }

  resource fileServices 'fileServices' = {
    name: 'default'

    resource fileShares 'shares' = [
      for shareName in fileShareNames: {
        name: shareName
      }
    ]
  }
}

resource storageDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: '${name}-diagnostics'
  scope: storageAccount
  properties: {
    workspaceId: logAnalyticsWorkspaceId
    metrics: [
      {
        category: 'Transaction'
        enabled: true
      }
    ]
  }
}

resource fileServicesDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: '${name}-file-diagnostics'
  scope: storageAccount::fileServices
  properties: {
    workspaceId: logAnalyticsWorkspaceId
    logs: [
      {
        category: 'StorageRead'
        enabled: true
      }
      {
        category: 'StorageWrite'
        enabled: true
      }
      {
        category: 'StorageDelete'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'Transaction'
        enabled: true
      }
    ]
  }
}

@description('The ID of the Storage Account.')
output id string = storageAccount.id

@description('The name of the Storage Account.')
output name string = storageAccount.name

@secure()
@description('The primary key of the Storage Account.')
output primaryKey string = storageAccount.listKeys().keys[0].value
