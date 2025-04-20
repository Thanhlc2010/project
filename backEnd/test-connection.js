const net = require('net');
const client = new net.Socket();

client.connect(3306, 'localhost', () => {
  console.log('Connection successful!');
  client.destroy();
}).on('error', (err) => {
  console.error('Connection error:', err);
  process.exit(1);
});