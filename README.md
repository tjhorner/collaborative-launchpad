# Collaborative Launchpad

**DO NOT INSTALL `midi-launchpad` FROM NPM!** I modified it so it could accept input and output ports. Instead, copy `midi-launchpad` into your `node_modules` directory.

## Getting your Launchpad's I/O ports

Run `node ports` and you'll see what ports your Launchpad is running on.

![](http://i.gyazo.com/bef08bf8e9a38e3c9839243e4638a265.png)

You'll want to replace the ports in the `connect` method with your ports.