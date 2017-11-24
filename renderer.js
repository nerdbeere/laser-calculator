const path = require('path');
const fs = require('fs');
const parser = require('gcode-parser');
const Simulator = require('./simulator');

const file = path.join(__dirname, './resources/aufstellschild1-2x.gcode');
const gcode = fs.readFileSync(file, 'utf8');

const parseArgs = (args) => {
  const argObj = {};
  args.forEach((arg) => {
    const [ name, value ] = arg;
    argObj[name] = value
  });

  return argObj;
};

parser.parseString(gcode, function(err, results) {
  const simulator = new Simulator();
  simulator.jogSpeed = 4000;

  results.forEach((line) => {
    const [ command, ...args ] = line.words;

    // G20: After this, units will be in inches
    if (command && command[0] === 'G' && command[1] === 20) {
      throw new Error('G20 currently not supported! Use the metric system');
    }

    // G21: After this, units will be in mm
    if (command && command[0] === 'G' && command[1] === 21) {
      return;
    }

    // G90: Switch to absolute distance mode
    if (command && command[0] === 'G' && command[1] === 90) {
      return;
    }

    // G91: Switch to incremental distance mode
    if (command && command[0] === 'G' && command[1] === 91) {
      throw new Error('Incremental Distance Mode currently not supported!');
    }

    // G0: 	Rapid positioning
    if (command && command[0] === 'G' && command[1] === 0) {
      const { X, Y } = parseArgs(args);
      simulator.jog(X, Y);
      return;
    }

    // G1: 	Linear interpolation
    if (command && command[0] === 'G' && command[1] === 1) {
      const { X, Y, S, F } = parseArgs(args);
      simulator.move(X, Y, S, F);
      return;
    }

    // other commands
    if (command) {
      console.log(command[0], command[1]);
    }

    // ignore other lines e.g. comments
  });

  console.log('time', simulator.calculateTime());
});
