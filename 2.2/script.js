let route = document.getElementById('route');
    let time = document.getElementById('time');
    let backTimeContainer = document.getElementById('back-time-container');
    let backTime = document.getElementById('back-time');
    let qtt = document.getElementById('num');
    let btn = document.querySelector('button');
    let output = document.getElementById('output');
    let price; let tripTime;
    let ab = [
        '2021-08-21 18:00:00',
        '2021-08-21 18:30:00',
        '2021-08-21 18:45:00',
        '2021-08-21 19:00:00',
        '2021-08-21 19:15:00',
        '2021-08-21 21:00:00'
    ];
    let ba = [
        '2021-08-21 18:30:00',
        '2021-08-21 18:45:00',
        '2021-08-21 19:00:00',
        '2021-08-21 19:15:00',
        '2021-08-21 19:35:00',
        '2021-08-21 21:50:00',
        '2021-08-21 21:55:00'
    ];

    route.onchange = () => {
        output.innerHTML = '';
        var i, L = time.options.length - 1;
        for(i = L; i >= 0; i--) {
            time.remove(i);
        }
        if (route.value != '') {
            time.disabled = qtt.disabled = false;
        } else {
            time.disabled = qtt.disabled = true;
        }
        if (route.value != 'из A в B и обратно в А') {
            backTimeContainer.style.display = 'none';
            let options;
            switch (route.value) {
                case 'из A в B':
                    options = ab;
                    break;
                    
                case 'из B в A':
                    options = ba;
                    break;
            }
            
            if (!options) return;
            Object.entries(options).forEach(([key, value]) => {
                let option = document.createElement('option');
                option.value = new Date(value + ' UTC +03:00');
                option.innerHTML = new Date(value + ' UTC +03:00').toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) + ' (' + route.value + ')';
                time.append(option);
            });            
            time.onchange = () => output.innerHTML = '';
            price = 700;
            tripTime = 50;

        } else {
            backTimeContainer.style.display = 'flex';
            Object.entries(ab).forEach(([key, value]) => {
                let option = document.createElement('option');
                option.value = new Date(value + ' UTC +03:00');
                option.innerHTML = new Date(value + ' UTC +03:00').toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) + ' (из A в B)';
                time.append(option);
            });
            function setBackTime() {
                var i, L = backTime.options.length - 1;
                for(i = L; i >= 0; i--) {
                    backTime.remove(i);
                }
                Object.entries(ba).forEach(([key, value]) => {
                    let option = document.createElement('option');
                    option.value = new Date(value + ' UTC +03:00');
                    let difference = (new Date(option.value) - new Date(time.value)) / 60000;
                    if (difference < 50) return;
                    option.innerHTML = new Date(value + ' UTC +03:00').toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) + ' (из B в A)';
                    backTime.append(option);
                });
                let tripDifference = (new Date(backTime.value) - new Date(time.value)) / 60000;
                tripTime = tripDifference + 50;
                backTime.onchange = () => {
                    output.innerHTML = '';                
                    let tripDifference = (new Date(backTime.value) - new Date(time.value)) / 60000;
                    tripTime = tripDifference + 50;
                };
            }
            setBackTime();
            time.onchange = () => {
                setBackTime(); 
                output.innerHTML = '';
            }
            price = 1200;
        }
        qtt.onkeyup = () => {
            if (qtt.value != '') {
                btn.disabled = false;
            } else {
                btn.disabled = true;
                output.innerHTML = '';
            }
        }
        btn.onclick = () => {
            if (route.value == '') return;
            let name = decOfNum(qtt.value, ['билет', 'билета', 'билетов']);
            let hours = (tripTime / 60);
            let rhours = Math.floor(hours);
            let minutes = (hours - rhours) * 60;
            let rminutes = Math.round(minutes);
            let tripDuration;
            if (rhours == 0) {
                tripDuration = rminutes + ' ' + decOfNum(rminutes, ['минута', 'минуты', 'минут']);
            } else {
                tripDuration = rhours + ' ' + decOfNum(rhours, ['час', 'часа', 'часов']) + ' ' + rminutes + ' ' + decOfNum(rminutes, ['минута', 'минуты', 'минут']);
            }
            let timeOut = new Date(time.value).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            let timeAr = new Date(new Date(time.value).getTime() + 50*60000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            
            let timeBackOut = new Date(backTime.value).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            let timeBackAr = new Date(new Date(backTime.value).getTime() + 50*60000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            if (route.value != 'из A в B и обратно в А') {
                output.innerText = `Вы выбрали ${qtt.value} ${name} по маршруту ${route.value} стоимостью ${qtt.value * price}₽.
                Это путешествие займет у вас ${tripDuration}.
                Теплоход отправляется в ${timeOut}, а прибудет в ${timeAr}.`;
            } else {
                output.innerText = `Вы выбрали ${qtt.value} ${name} по маршруту ${route.value} стоимостью ${qtt.value * price}₽.
                Это путешествие займет у вас ${tripDuration}.
                Теплоход отправляется в ${timeOut}, а прибудет в ${timeAr}.
                Теплоход отправляется обратно в ${timeBackOut}, а прибудет в ${timeBackAr}.`;
            }
        }
    }

    var decCache = [],
    decCases = [2, 0, 1, 1, 1, 2];
    function decOfNum(number, titles)
    {
        if(!decCache[number]) decCache[number] = number % 100 > 4 && number % 100 < 20 ? 2 : decCases[Math.min(number % 10, 5)];
        return titles[decCache[number]];
    }