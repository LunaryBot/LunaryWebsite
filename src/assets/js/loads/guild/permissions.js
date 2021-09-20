const content = $("#content")
const guild = JSON.parse($("#guild-data").html())
const guildDB = JSON.parse($("#guild-db-data").html())

content.html(content.html() + `
    <div id="roles">
        <div class="card">
            <div class="card-content">
            ${Object.entries(guildDB.staffroles || {}).map(function([k, v]) {
                const roles = guild.roles || []
                
                const role = roles.find(x => x.id == k) || (k ? {
                    name: "Deleted Role",
                    id: k
                } : null)
                const ps = new Permissions(v || 0)
                return `<label><strong>Cargo:</strong></label>
                <div class="select-wrapper" type="selectmenu" data-send-on-save>
                        <div class="select" id="muterole">
                            <div class="select__trigger"><p>${(function() {
                                let a = "Selecionar Cargo"
                                if(role) {
                                    a = role.name
                                }
    
                                return a
                            })()}</p>
                        </div>
                        <p class="select-menu-search"><input type="text" value="" autocomplete="off" placeholder="Nome/ID" name="search"><i class="icon fas fa-search"></i></p>
                        <div class="custom-options close" id="co-chat_modlogs">
                            <span class="custom-option ${!role ? "selected" : ""}" data-value="none" name="Selecionar Cargo">Nenhum</span>
                            ${guild.roles.sort((a, b) => b.rawPosition - a.rawPosition).map(function(role) {
                                return `<span class="custom-option ${role.id == k  ? "selected" : ""}" style="color: #${(role.color || 16777215).toString(16)};" data-value="${role.id}"> <p>${role.name}</p> </span>`
                            }).join("")}
                        </div>
                    </div>
                </div>
                <br><div class="check-radio">
                    <input type="checkbox" name="lunar_ban_members" id="lunar_ban_members" ${ps.has("LUNAR_BAN_MEMBERS") ? "checked" : ""} data-send-on-save bitfield /><label style="margin-left: 1%; font-size: 18px"><strong>Banir Membros</strong></label>
                    <p>Permite que um membro com o cargo aplique banimentos no servidor usando o bot(Lunar), <code>/ban</code>.</p>   
                </div>
                <hr>
                <div class="check-radio">
                    <input type="checkbox" name="lunar_kick_members" id="lunar_kick_members" ${ps.has("LUNAR_KICK_MEMBERS") ? "checked" : ""} data-send-on-save bitfield /><label style="margin-left: 1%; font-size: 18px"><strong>Expulsar Membros</strong></label>
                    <p>Permite que um membro com o cargo expulsem membros do servidor usando o bot(Lunar), <code>/kick</code>.</p>  
                </div>
                <hr>
                <div class="check-radio">
                    <input type="checkbox" name="lunar_mute_members" id="lunar_mute_members" ${ps.has("LUNAR_MUTE_MEMBERS") ? "checked" : ""} data-send-on-save bitfield /><label style="margin-left: 1%; font-size: 18px"><strong>Silenciar Membros</strong></label>
                    <p>Permite que um membro com o cargo silenciem membros do servidor usando o bot(Lunar), <code>/mute</code>.</p>  
                </div>
                <hr>
                <div class="check-radio">
                    <input type="checkbox" name="lunar_adv_members" id="lunar_adv_members" ${ps.has("LUNAR_MUTE_MEMBERS") ? "checked" : ""} data-send-on-save bitfield /><label style="margin-left: 1%; font-size: 18px"><strong>Advertir Membros</strong></label>
                    <p>Permite que um membro com o cargo aplique uma advertência/aviso em um membro do servidor, <code>/adv</code>.</p>  
                </div>`
            }).join("")}
            </div>
        </div>
    </div>

    <div class="card"><div class="card-content" align="center" id="save" onclick="save()"><h1>Save</h1></div></div>  
`)