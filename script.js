document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const buildingValue = urlParams.get('building');

    if (!buildingValue) {
        return;
    }

    try {
        const response = await fetch('lectures.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const classrooms = await response.json();

        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const currentTime = now.toTimeString().slice(0, 5);

        if (currentDay === 'saturday' || currentDay === 'sunday') {
            const message = document.createElement('p');
            message.textContent = '오늘은 주말입니다!';
            document.body.appendChild(message);
            return;
        }

        const classroomList = document.getElementById('classroom-list');
        let hasAvailableClassroom = false;

        classrooms.forEach(classroom => {
            const classroomPrefix = classroom.classroomNumber.slice(0, 2);

            if (classroomPrefix === buildingValue) {
                const schedule = classroom.schedule?.[currentDay];
                let isOccupied = false;

                if (schedule) {
                    schedule.forEach(course => {
                        const [startTime, endTime] = course.time.split(' ~ ');

                        if (currentTime >= startTime && currentTime <= endTime) {
                            isOccupied = true;
                        }
                    });
                }

                if (!isOccupied) {
                    const li = document.createElement('li');
                    li.textContent = classroom.classroomNumber;
                    li.style.display = 'flex';
                    li.style.justifyContent = 'center';
                    li.style.fontSize = '35px';
                    li.style.lineHeight = '1.8';
                    classroomList.appendChild(li);
                    hasAvailableClassroom = true;
                }
            }
        });

        if (!hasAvailableClassroom) {
            const li = document.createElement('li');
            li.textContent = '빈 강의실이 없습니다!';
            li.style.display = 'flex';
            li.style.justifyContent = 'center';
            li.style.fontSize = '35px';
            li.style.lineHeight = '1.8';
            classroomList.appendChild(li);
        }
    } catch (error) {
        console.error('Failed to fetch JSON data:', error);
    }
});

function redirectToNextPage() {
    const radios = document.querySelectorAll('input[name="building"]');
    let selectedValue;

    for (const radio of radios) {
        if (radio.checked) {
            selectedValue = radio.value;
            break;
        }
    }

    if (selectedValue) {
        window.location.href = 'empty_classroom.html?building=' + selectedValue;
    }
}
