function playSound() {
	source.noteOn(context.currentTime);
}

function routeSound(data) {
	source = context.createBufferSource();
	buffer = context.createBuffer(data, true);
	source.buffer = buffer;
	source.connect(context.destination);
	playSound(source);
}

var socket = io();

socket.on('launchpad:on', function(m){
	$($('[data-y="' + m.y + '"]').find('td')[m.x]).removeClass('red orange green yellow').addClass('on ' + m.color);
	if(m.y === 8 && m.x === 0){

	}
});

socket.on('launchpad:off', function(m){
	$($('[data-y="' + m.y + '"]').find('td')[m.x]).removeClass('on red orange green yellow');
});

socket.on('socket:error', function(m){
	alert('Error: ' + m.error);
});

$(document).ready(function(){
	$.each($('.launchpad tr'), function(i, e){
		$.each($(e).find('td'), function(i2, e2){
			if(!$(e2).hasClass('logo')){
				$(e2).click(function(){
					var x = i2;
					var y = parseInt($(e).attr('data-y'));
					var data = {x: x, y: y, color: $('#color')[0].value};
					socket.emit('launchpad:toggle', JSON.stringify(data));
				});
			}else{
				$(e2).click(function(){
					window.location = "http://www.image-line.com/flstudio/";
				});
			}
		});
	});

	$('#color').change(function(){
		$('#color').css('background', $('#color')[0].value);
	});
});