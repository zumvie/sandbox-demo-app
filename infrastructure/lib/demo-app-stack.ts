import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Backend } from "./backend";
import { Distribution } from "./distribution";
import { Frontend } from "./frontend";

export class DemoAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const backend = new Backend(this, "Backend");
    const frontend = new Frontend(this, "Frontend");

    const distribution = new Distribution(this, "Distribution", {
      backend,
      frontend,
    });

    distribution.invalidateCache();
  }
}
