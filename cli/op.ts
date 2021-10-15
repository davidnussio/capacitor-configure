export interface Operation {
  id: string;
  platform: string;
  name: string;
  value: any;
  displayText: string;
}

// Given the parsed yaml file, generate a set of operations to perform against the project
export function processOperations(yaml: any) {
  // return processEnvironments(yaml.environments).flat();
  return Object.keys(yaml.platforms)
    .map(p => createPlatform(p, yaml.platforms[p]))
    .flat();
}

/*
function processEnvironments(envs) {
  return Object.keys(envs)
    .map(env => createEnvironment(env, envs[env]))
    .flat();
}

function createEnvironment(env, envEntry) {
  return Object.keys(envEntry || {}).map(platform =>
    createPlatform(env, platform, envEntry[platform]),
  );
}
*/

function createPlatform(platform, platformEntry) {
  return Object.keys(platformEntry || {}).map(op =>
    createOperation(platform, op, platformEntry[op]),
  );
}

function createOperation(platform, op, opEntry): Operation {
  const opRet = {
    id: `${platform}.${op}`,
    platform,
    name: op,
    value: opEntry,
  };

  return {
    ...opRet,
    displayText: createOpDisplayText(opRet),
  };
}

// TODO: Move this to per-operation for more powerful display
function createOpDisplayText(op) {
  switch (op.id) {
    // ios
    case 'ios.bundleId':
      return op.value;
    case 'ios.productName':
      return op.productName;
    case 'ios.version':
      return op.value;
    case 'ios.buildNumber':
      return op.value;
    case 'ios.buildSettings':
      return Object.keys(op.value)
        .map(k => `${k} = ${op.value[k]}`)
        .join(', ');
    case 'ios.entitlements':
      return op.value.map(v => Object.keys(v)).join(', ');
    case 'ios.frameworks':
      return op.value.join(', ');
    case 'ios.plist':
      return `${op.value.length} modifications`;
    // android
    case 'android.packageName':
      return op.value;
    case 'android.versionName':
      return op.value;
    case 'android.versionCode':
      return op.value;
    case 'android.build.gradle':
      return '';
    case 'android.app.build.gradle':
      return '';
    case 'android.res':
      return op.value.map(r => r.file).join(', ');
  }

  return '';
}
