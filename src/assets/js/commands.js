const constants = {
  "userID": "822470491574763580",
  "user-tag": "Pinho#1856",
  "@user": "@Pinho",
  "reason": "Regra 13: É biscoito, bobo",
  "notify-dm": "True",
  "time": "1h30m",
  "amountClear": "132",
  "amount": "3",
  "id": "mhjr44cg-f1yu-0o2d-8wxq-m3n56kbgwp"
}

const categorys = {
  "moderation": "Moderação",
  "administration": "Administração",
  "utilities": "Utilitarios",
  "bot": "Luny",
  "owner": "Owner"
}

$(document).ready(function(){$(function(){
  var $commands=$('#commands-list');
  $.getJSON('http://localhost:3000/json/commands.json', function(data,status){
    $.each(data.commands,function(_,command){$commands.append(`
          <div class="command ${command.group}" name="${command.name}">
          <div class="command-heading">
          <div class="group-icon group-for-${command.name.replace(/ +/g, "_")}" style="background-color: #a020f0">
              <p>${categorys[command.group] || 'No group'}</p>
            </div>
            <div class="command-heading-left">
              <div class="arrow-icon">
                <svg aria-hidden="true" role="img" viewBox="0 0 320 512" class="icon-expand">
                  <path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path>
                </svg>
              </div> <h1> ${command.name} </h1>
            </div>
           </div>
           <div class="command-details ${command.name.replace(/ +/g, "_")}-1">
            <p>
              ${String(command.description).replace(/<:\w{1,}:\d{17,19}>/g,'').replace(/\[([^\]]+)\]\(([^\)]+)\)/,'<a href="$2">$1</a>').replace(/\`(\w{1,})\`/g,'<code>$1</code>')||'No description'}<br>
              ${command.dm?' <span class="code-style-inline-red">Bloqueado em DM</span> ':""}
              ${command.ownerOnly?' <span class="code-style-inline-red">Owner</span> ':''}
              ${command.userDiscordPermissions?.map(x=>{
                return `<span class="code-style-inline-blue">${x.split('_').map(p=>p.charAt(0).toUpperCase()+p.slice(1).toLowerCase()).join(' ')}</span>`}).join(' ')||(command.ownerOnly?'':' <span class="code-style-inline-green">Everyone</span> ')}
              ${command.botUserPermissions?.map(x=>{
                return `<span class="code-style-inline-purple">${x.split('_').map(p=>p.charAt(0).toUpperCase()+p.slice(1).toLowerCase()).join(' ')}</span>`}).join(' ') || ""}
              ${command.lunyDiscordPermissions?.map(x=>{
                return `<span class="code-style-inline-red">${x.split('_').map(p=>p.charAt(0).toUpperCase()+p.slice(1).toLowerCase()).join(' ')}</span>`}).join(' ') || ""}
              <br><br><br>
              Exemplos/s:<br>
              ${command.examples ? 
                Array.isArray(command.examples) ? command.examples.map(x=> x.title ? '<strong>' + x.title + '</strong>' + '<br><code>/' + command.name + ' ' + replaceUsage(x.usage) + '</code>' : '<br><code>/' + command.name + ' ' + replaceUsage(x) + '</code>').join('<br>') : replaceUsage(command.examples)
              : '<code>/' + command.name + '</code>'
              }
            </p>
           </div>
          </div>
        `)
      }
    );
$('.commands-still-loading').hide();
$('.command').hide();
$('.Moderação').show();
$('.command-details').hide();
$('.clock-icon').hide()}).catch(()=>{$('.commands-still-loading').hide();$('.commands-loading-failed').show();});});});
$(document).ready(function(){
    $('.col-2-btn').click(function(){
        $('.col-2-btn').removeClass('active');
        $(this).addClass('active');
        $(".search-box").val('');
        const attr = $(this).attr('data-li');
        $('.command').hide();
        $(`.${attr}`).show();
    });
    $('.checkbox-expand').click(function(){
        if($('.checkbox-expand').is(':checked')) {
            $('.command-details').slideDown(300);
            $('.clock-icon').show();
        } else {
            $('.command-details').slideUp(300);
            $('.clock-icon').hide();
        }
    })
$(document).on('click','.command', function(){
    const attr = $(this).attr('name').replace(/ +/g, "_");
    console.log(attr)
    $(`.clock-for-${attr}`).toggle(300);
    $(`.${attr}-1`).slideToggle(300);
});
$(".search-box").on("keyup",function(){
    var value=$(this).val().toLowerCase().trim();
    if(!value){
        const attr = $('.col-2-btn.active').attr('data-li');
        $('.command').hide();
        $(`.${attr}`).show();
        return;
    };
    $(".commands div").filter(function(_,el){
        if(!$(el).hasClass('command')){ return; };
        $(this).toggle($(this).text().toLowerCase().trim().indexOf(value)>-1)});
    });
});

function replaceUsage(string) {
  console.log(string)
  if(string) {
    Object.entries(constants).forEach(([key, value]) => {
      string = string.replace(new RegExp(`{${key}}`, 'g'), value);
    });
  }

  return string;
}