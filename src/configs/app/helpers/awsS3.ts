/**
 * Configuration loader for AWS S3.
 * @returns {{ region: string }} AWS S3 configuration.
 */
function awsS3ConfigLoader() {
    const config = {
        region: `eu-north-1`,
    };
    return config;
}

export { awsS3ConfigLoader };
