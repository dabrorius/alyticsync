function initConfigWriter(path, fs) {
  return content => {
    let config = {};
    if (fs.existsSync(path)) {
      config = JSON.parse(fs.readFileSync(path, "utf-8"));
    }
    config = Object.assign(config, content);
    fs.writeFile(path, JSON.stringify(config, null, 2), err =>
      console.log(err)
    );
  };
}

module.exports = initConfigWriter;
