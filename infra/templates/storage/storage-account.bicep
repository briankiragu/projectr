@description('The Azure region where the Storage Account will be deployed.')
param location string

@description('The name of the Storage Account.')
param name string

@description('The ID of the Log Analytics Workspace.')
param logAnalyticsWorkspaceId string

@description('Tags to apply to resources')
param tags object

resource storageAccount 'Microsoft.Storage/storageAccounts@2025-06-01' = {
  location: location
  tags: tags
  name: '${name}${location}'
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }

  resource fileServices 'fileServices' = {
    name: 'default'

    // Create shares matching your docker volumes
    resource shareMysql 'shares' = {
      name: 'mysql-data'
    }

    resource shareRedis 'shares' = {
      name: 'redis-data'
    }

    resource shareDirectus 'shares' = {
      name: 'directus-data'
    }

    resource shareMeili 'shares' = {
      name: 'meili-data'
    }

    resource shareMeiliSync 'shares' = {
      name: 'meilisync-data'
    }
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
