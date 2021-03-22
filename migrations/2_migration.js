const Note = artifacts.require('Note')

module.exports = function (deployer) {
    deployer.deploy(Note)
}