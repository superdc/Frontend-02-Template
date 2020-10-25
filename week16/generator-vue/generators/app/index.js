var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    this.name = this.appname;
  }

  async initPackage() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // Default to current folder name
      }
    ]);
    this.name = answers.name;
    const pkgJson = {
      "name": answers.name,
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "build": "webpack"
      },
      "author": "",
      "license": "ISC",
      "dependencies": {
      },
      "devDependencies": {
      }
    };
    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    this.npmInstall(['vue'], { 'save-dev': false });
    this.npmInstall(['webpack','webpack-cli','vue-loader','vue-template-compiler',
      'vue-style-loader','css-loader','@babel/core','babel-loader','copy-webpack-plugin'], { 'save-dev': true });
  }

  copyFiles() {
    this.fs.copyTpl(
      this.templatePath('helloWorld.vue'),
      this.destinationPath('src/helloWorld.vue'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      {title: this.name}
    );
    this.fs.copyTpl(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore'),
      {title: this.name}
    );
  }
};
