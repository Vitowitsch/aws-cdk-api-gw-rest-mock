# Module Description

Infrastructure code plus Mock Implementation using OpenAPI (swagger) configuration for AWS Application Gateway.

CDK infrastructure code written in Typescript.

With git-pre-commit hooks for linting and formatting.


## Initial Deployment
* Manual deployment was performed once to install the Code Pipeline: `cdk deploy ApiGwServiceMockPipelineStack`
* Changes can now be applied again manually or by merging the change to the main branch. 
  This will automatically trigger the pipeline for the new deployment.
