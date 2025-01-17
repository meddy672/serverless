'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const path = require('path');
const AwsPackage = require('../../../../../../../lib/plugins/aws/package/index');
const Serverless = require('../../../../../../../lib/serverless');
const AwsProvider = require('../../../../../../../lib/plugins/aws/provider');

describe('#saveCompiledTemplate()', () => {
  let serverless;
  let awsPackage;
  let getCompiledTemplateFileNameStub;
  let writeFileSyncStub;

  beforeEach(() => {
    const options = {};
    serverless = new Serverless({ commands: [], options: {} });
    serverless.setProvider('aws', new AwsProvider(serverless, options));
    awsPackage = new AwsPackage(serverless, options);
    serverless.serviceDir = 'my-service';
    serverless.service = {
      provider: {
        compiledCloudFormationTemplate: 'compiled content',
      },
    };
    getCompiledTemplateFileNameStub = sinon
      .stub(awsPackage.provider.naming, 'getCompiledTemplateFileName')
      .returns('compiled.json');
    writeFileSyncStub = sinon.stub(awsPackage.serverless.utils, 'writeFileSync').returns();
  });

  afterEach(() => {
    awsPackage.provider.naming.getCompiledTemplateFileName.restore();
    awsPackage.serverless.utils.writeFileSync.restore();
  });

  it('should write the compiled template to disk', async () => {
    const filePath = path.join(awsPackage.serverless.serviceDir, '.serverless', 'compiled.json');

    return awsPackage.saveCompiledTemplate().then(() => {
      expect(getCompiledTemplateFileNameStub.calledOnce).to.equal(true);
      expect(writeFileSyncStub.calledWithExactly(filePath, 'compiled content')).to.equal(true);
    });
  });
});
