const Homey = require('homey');

module.exports = {
    getIp: async function (homey) {
        let ip;
        if (Homey.env.HOMEY_IP) {
            ip = Homey.env.HOMEY_IP;
        } else {
            ip = await homey.cloud.getLocalAddress();
            // Homey adds a port, so remove that
            // Old implement was always removing the last three characters, so keep using that for now
            ip = ip.slice(0, -3);
        }

        console.debug('Local IP: ', ip);

        return ip;
    },
};
