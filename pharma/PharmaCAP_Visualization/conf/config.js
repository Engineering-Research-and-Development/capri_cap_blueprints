var config = {};

config.iota = {
    /**
     * Configures the log level. Appropriate values are: FATAL, ERROR, INFO, WARN and DEBUG.
     */
    logLevel: 'DEBUG',
    /**
     * When this flag is active, the IoTAgent will add the TimeInstant attribute to every entity created, as well
     * as a TimeInstant metadata to each attribute, with the current timestamp.
     */
    timestamp: true,
    /**
     * Context Broker configuration. Defines the connection information to the instance of the Context Broker where
     * the IoT Agent will send the device data.
     */
    contextBroker: {
        /**
         * Host where the Context Broker is located.
         */
        host: 'orion',
        /**
         * Port where the Context Broker is listening.
         */
        port: '1026',
        /**
         * Version of the Context Broker (v2 or ld)
         */
        ngsiVersion: 'v2',
        /**
         * JSON LD Context
         */
        jsonLdContext: 'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld',
        /**
         * Used as fallbackTenant
         */
        service: 'pharma',
        /**
         * Used as fallbackPath
         */
        subservice: '/cap'
    },
    /**
     * Configuration of the North Port of the IoT Agent.
     */
    server: {
        /**
         * Port where the IoT Agent will be listening for NGSI and Provisioning requests.
         */
        port: 4001
    },

    /**
     * Configuration for secured access to instances of the Context Broker secured with a PEP Proxy.
     * For the authentication mechanism to work, the authentication attribute in the configuration has to be fully
     * configured, and the authentication.enabled subattribute should have the value `true`.
     *
     * The Username and password should be considered as sensitive data and should not be stored in plaintext.
     * Either encrypt the config and decrypt when initializing the instance or use environment variables secured by
     * docker secrets.
     */
    //authentication: {
    //enabled: false,
    /**
     * Type of the Identity Manager which is used when authenticating the IoT Agent.
     */
    //type: 'keystone',
    /**
     * Name of the additional header passed to hold the identity of the IoT Agent
     */
    //header: 'X-Auth-Token',
    /**
     * Hostname of the Identity Manager.
     */
    //host: 'localhost',
    /**
     * Port of the Identity Manager.
     */
    //port: '5000',
    /**
     * Username for the IoT Agent - Note this should not be stored in plaintext.
     */
    //user: 'IOTA_AUTH_USER',
    /**
     * Password for the IoT Agent - Note this should not be stored in plaintext.
     */
    //password: 'IOTA_AUTH_PASSWORD',
    /**
     * OAuth2 client ID - Note this should not be stored in plaintext.
     */
    //clientId: 'IOTA_AUTH_CLIENT_ID',
    /**
     * OAuth2 client secret - Note this should not be stored in plaintext.
     */
    //clientSecret: 'IOTA_AUTH_CLIENT_SECRET'
    //},

    /**
     * Defines the configuration for the Device Registry, where all the information about devices and configuration
     * groups will be stored. There are currently just two types of registries allowed:
     *
     * - 'memory': transient memory-based repository for testing purposes. All the information in the repository is
     *             wiped out when the process is restarted.
     *
     * - 'mongodb': persistent MongoDB storage repository. All the details for the MongoDB configuration will be read
     *             from the 'mongodb' configuration property.
     */
    deviceRegistry: {
        type: 'memory'
    },
    /**
     * Mongo DB configuration section. This section will only be used if the deviceRegistry property has the type
     * 'mongodb'.
     */
    mongodb: {
        /**
         * Host where MongoDB is located. If the MongoDB used is a replicaSet, this property will contain a
         * comma-separated list of the instance names or IPs.
         */
        host: 'iot_mongo',
        /**
         * Port where MongoDB is listening. In the case of a replicaSet, all the instances are supposed to be listening
         * in the same port.
         */
        port: '27017',
        /**
         * Name of the Mongo database that will be created to store IoT Agent data.
         */
        db: 'iotagent_opcua'
    },
    /**
     * Types array for static configuration of services. Check documentation in the IoT Agent Library for Node.js for
     *  further details:
     *
     *      https://github.com/Engineering-Research-and-Development/iotagent-opcua#type-configuration
     */
    types: {},
    contexts: [],
    contextSubscriptions: [],
    /**
     * Default service, for IoT Agent installations that won't require preregistration.
     */
    service: 'pharma',
    /**
     * Default subservice, for IoT Agent installations that won't require preregistration.
     */
    subservice: '/cap',
    /**
     * URL Where the IoT Agent Will listen for incoming updateContext and queryContext requests (for commands and
     * passive attributes). This URL will be sent in the Context Registration requests.
     */
    providerUrl: 'http://iotage:4001',
    /**
     * Default maximum expire date for device registrations.
     */
    deviceRegistrationDuration: 'P20Y',
    /**
     * Default type, for IoT Agent installations that won't require preregistration.
     */
    defaultType: 'Device',
    /**
     * Default resource of the IoT Agent. This value must be different for every IoT Agent connecting to the IoT
     * Manager.
     */
    defaultResource: '/iot/opcua',
    /**
     * flag indicating whether the incoming measures to the IoTAgent should be processed as per the "attributes" field.
     */
    explicitAttrs: false
};

config.opcua = {
    /**
     * Endpoint where the IoT Agent will listen for an active OPC UA Server.
     */
    endpoint: 'opc.tcp://{IP}:{PORT}{URI}',
    /**
     * Security Mode to access OPC UA Server.
     */
    securityMode: 'None',
    /**
     * Security Policy to access OPC UA Server.
     */
    securityPolicy: 'None',
    /**
     * Username to access OPC UA Server.
     */
    username: null,
    /**
     * Password to access OPC UA Server.
     */
    password: null,
    /**
     * Flag indicating whether the OPC uA variables readings should be handled as single subscription.
     */
    uniqueSubscription: false
};

config.mappingTool = {
    /**
     *  Boolean property to assess whether enable polling in MappingTool or not
     */
    polling: false,
    /**
     * agentId prefix to be assigned to the newly generated entity from MappingTool execution
     */
    agentId: 'age01_',
    /**
     * Namespaces to ignore when crawling nodes from OPC UA Server
     */
    namespaceIgnore: '0,7',
    /**
     * entityId to be assigned to the newly generated entity from MappingTool execution
     */
    entityId: 'age01_Pharma',
    /**
     * entityType to be assigned to the newly generated entity from MappingTool execution
     */
    entityType: 'Device'
};

/**
 * map {name: function} of extra transformations avaliable at JEXL plugin
 *  see https://github.com/telefonicaid/iotagent-node-lib/tree/master/doc/expressionLanguage.md#available-functions
 */

config.jexlTransformations = {};

/**
 * flag indicating whether the incoming notifications to the IoTAgent should be processed using the bidirectionality
 * plugin from the latest versions of the library or the OPCUA-specific configuration retrieval mechanism.
 */
config.configRetrieval = false;
/**
 * Default API Key, to use with device that have been provisioned without a Configuration Group.
 */
config.defaultKey = 'iot';
/**
 * Default transport protocol when no transport is provisioned through the Device Provisioning API.
 */
config.defaultTransport = 'OPCUA';
/**
 * flag indicating whether the node server will be executed in multi-core option (true) or it will be a
 * single-thread one (false).
 */
//config.multiCore = false;
/**
 * flag indicating whether or not to provision the Group and Device automatically
 */
config.autoprovision = true;

module.exports = config;