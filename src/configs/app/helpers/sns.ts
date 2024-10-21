/**
 * Configuration loader for AWS SES.
 * @returns {{ region: string }} AWS SES configuration.
 */
function awsSNSConfigLoader() {
    const config = {
        region: `eu-north-1`,
    };
    return config;
}

export { awsSNSConfigLoader };
