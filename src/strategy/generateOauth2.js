const { Permissions } = require("discord.js")
const InviteScopes = [
    'applications.builds.read',
    'applications.commands',
    'applications.entitlements',
    'applications.store.update',
    'bot',
    'connections',
    'email',
    'identify',
    'guilds',
    'guilds.join',
    'gdm.join',
    'webhook.incoming'
]

/**
 * @param {{
 *   client_id:string,
 *   scopes:string[],
 *   permissions:bigint,
 *   disableGuildSelect:boolean,
 *   guild:string,
 *   redirect:string,
 *   redirect_uri:string,
 *   state:string
 * }} options
 */
function generateOauth2(options = {}) {
    if(typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object', true);
    let client_id = options.client_id
     
    if(!client_id) client_id = process.env.clientId
 
    const query = new URLSearchParams({
        client_id: client_id,
        response_type: "code"
    });
 
    const { scopes } = options;
     
    if(scopes && Array.isArray(scopes)) {
        const invalidScope = scopes.find(scope => !InviteScopes.includes(scope));
        if(invalidScope) throw new TypeError('INVALID_ELEMENT', 'Array', 'scopes', invalidScope);
        query.set('scope', scopes.join(' '));
    }
 
    if(options.permissions) {
        const permissions = Permissions.resolve(options.permissions);
        if(permissions) query.set('permissions', permissions);
    }
 
    if(options.disableGuildSelect) query.set('disable_guild_select', true)
 
    if(options.guild) {
        const guildId = this.guilds.resolveId(options.guild);
        if(!guildId) throw new TypeError('INVALID_TYPE', 'options.guild', 'GuildResolvable');
        query.set('guild_id', guildId);
    }

    if(options.redirect_uri || options.redirect) query.set('redirect_uri', options.redirect_uri || options.redirect)
    if(options.state) query.set('state', options.state)
 
    return `https://discord.com/api/oauth2/authorize?${query.toString()}`;
}

module.exports = generateOauth2