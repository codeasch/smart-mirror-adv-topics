Module.register("MMM-SchoolBellCountdown", {
    defaults: {
        schedule: [
            { period: "0", start: "07:50", end: "08:35" },
            { period: "1", start: "08:45", end: "09:30" },
            { period: "2", start: "09:35", end: "10:25" },
            { period: "3", start: "10:30", end: "11:15" },
            { period: "4", start: "11:20", end: "12:05" },
            { period: "5", start: "12:10", end: "12:55" },
            { period: "6", start: "13:00", end: "13:45" },
            { period: "7", start: "13:50", end: "14:35" },
            { period: "8", start: "14:40", end: "15:25" }
        ],
        updateInterval: 1000 // Updates every second
    },

    start: function () {
        this.syncUpdate(); // Ensures updates are exactly on time
    },

    getStyles: function () {
        return ["MMM-SchoolBellCountdown.css"];
    },

    getDom: function () {
        let wrapper = document.createElement("div");
        let now = new Date();
        let currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to total minutes

        let activePeriod = null;
        let nextPeriod = null;
        let lastPeriodEnd = 0;

        for (let i = 0; i < this.config.schedule.length; i++) {
            let startTime = this.timeToMinutes(this.config.schedule[i].start);
            let endTime = this.timeToMinutes(this.config.schedule[i].end);

            if (currentTime >= startTime && currentTime < endTime) {
                activePeriod = this.config.schedule[i];
                break;
            } else if (currentTime < startTime) {
                nextPeriod = this.config.schedule[i];
                lastPeriodEnd = this.timeToMinutes(this.config.schedule[i - 1]?.end || 0);
                break;
            }
        }

        let progressContainer = document.createElement("div");
        progressContainer.className = "progress-container";

        let progressBar = document.createElement("div");
        progressBar.className = "progress-bar";

        let progressFill = document.createElement("div");
        progressFill.className = "progress-fill";

        let percentage = 0;
        let secondsLeft = 0;
        let countdownText = "";

        if (activePeriod) {
            let totalDuration = this.timeToMinutes(activePeriod.end) - this.timeToMinutes(activePeriod.start);
            let elapsedTime = currentTime - this.timeToMinutes(activePeriod.start);
            percentage = ((elapsedTime * 60 + now.getSeconds()) / (totalDuration * 60)) * 100;

            secondsLeft = (this.timeToMinutes(activePeriod.end) * 60) - (currentTime * 60 + now.getSeconds());

            countdownText = `Period <span class="bold">${activePeriod.period}</span> ends in 
                <span class="time bold" id="countdown-timer">${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60).toString().padStart(2, '0')}</span>`;
        } else if (nextPeriod) {
            let totalDuration = this.timeToMinutes(nextPeriod.start) - lastPeriodEnd;
            let elapsedTime = currentTime - lastPeriodEnd;
            percentage = ((elapsedTime * 60 + now.getSeconds()) / (totalDuration * 60)) * 100;

            secondsLeft = (this.timeToMinutes(nextPeriod.start) * 60) - (currentTime * 60 + now.getSeconds());

            countdownText = `Passing Period <span class="bold">${nextPeriod.period}</span> ends in 
                <span class="time bold" id="countdown-timer">${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60).toString().padStart(2, '0')}</span>`;
        } else {
            countdownText = "School day has ended!";
        }

        progressFill.style.width = `${percentage}%`;

        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressBar);
        wrapper.appendChild(progressContainer);

        let textWrapper = document.createElement("div");
        textWrapper.className = "countdown-text";
        textWrapper.innerHTML = countdownText;

        wrapper.appendChild(textWrapper);

        return wrapper;
    },

    timeToMinutes: function (time) {
        let [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    },

    syncUpdate: function () {
        setInterval(() => {
            this.smoothUpdate();
        }, 1000);
    },

    smoothUpdate: function () {
        let progressFill = document.querySelector(".progress-fill");
        let timeElement = document.querySelector("#countdown-timer");

        if (!progressFill || !timeElement) return;

        let now = new Date();
        let seconds = now.getSeconds();
        progressFill.style.width = `${(seconds / 60) * 100}%`;
    }
});
