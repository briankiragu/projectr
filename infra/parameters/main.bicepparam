using '../main.bicep'

// ========================================================================
// Monitoring & Logging
// ========================================================================
param logAnalyticsWorkspaceName = 'projectr-logs'

// ========================================================================
// Security & Identity
// ========================================================================
param managedIdentityName = 'projectr-uami'

// ========================================================================
// Networking
// ========================================================================
param publicIpName = 'projectr-public-ip'
param natGatewayName = 'projectr-nat-gateway'
param vnetName = 'projectr-vnet'
param vnetAddressPrefix = '10.0.0.0/16'
param mysqlSubnetAddressPrefix = '10.0.0.0/24'
param acaSubnetAddressPrefix = '10.0.2.0/23'

// ========================================================================
// Storage
// ========================================================================
param storageAccountName = 'projectrsa'
param fileShareNames = ['directus-data', 'meili-data', 'meilisync-data']

// ========================================================================
// Database
// ========================================================================
param sqlServerName = 'projectr-sql-server'
param sqlDBName = 'projectrdb'
param sqlDBUser = '********'
param sqlDBUserPassword = '********'

// ========================================================================
// Caching
// ========================================================================
param redisCacheName = 'projectr-redis'

// ========================================================================
// Compute
// ========================================================================
param containerAppEnvName = 'projectrappenv'
param containerAppName = 'projectr-app'

// ========================================================================
// Application Secrets
// ========================================================================
// In a real scenario, these should be passed from Key Vault or pipeline variables
// For local development/testing, you can fill these in.
param meiliMasterKey = '00000000-0000-0000-0000-000000000000'

param directusKey = '00000000-0000-0000-0000-000000000000'
param directusSecret = '00000000-0000-0000-0000-000000000000'

param directusAdminEmail = '********'
param directusAdminPassword = '********'

// ========================================================================
// Tags
// ========================================================================
param tags = {
  project: 'projectr'
  managedBy: 'Bicep'
}
