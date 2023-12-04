// https://github.com/mostlypixels/mpscreensitter
class MpScreensitter {
    sitter;
    seat_class = 'seat';
    sitter_class = 'sitter'
    sitter_images = ['./sitter.gif'];
    sitter_offset_x = 0;
    sitter_offset_y = 0;

    constructor(options) {
        for (const [key, value] of Object.entries(options)) {
            if (this[key] !== undefined) {
                this[key] = value;
            }
        }
        this.init();
    }

    init() {
        this.createSitter();
        this.registerEvents();
    }

    registerEvents() {
        let self = this;
        let elements = document.getElementsByClassName(this.seat_class);

        Array.from(elements).forEach(function (element) {
            element.addEventListener('touchstart', function (event) {
                let seat = event.target.closest('.' + self.seat_class);
                if (seat !== null) {
                    self.moveScreenSitter(seat);
                }
            });
            element.addEventListener('mouseenter', function (event) {
                self.moveScreenSitter(event.target);
            });
            element.addEventListener('mouseleave', function (event) {
                self.hideScreenSitter();
            });
        });
    }

    hideScreenSitter() {
        this.sitter.style.display = 'none';
        this.removeSittingClassFromAll();
    }

    moveScreenSitter(target) {
        if (target.classList.contains(this.getSittingClass())) {
            return;
        }

        this.setSitterImage();
        this.sitter.style.display = 'inline-block';
        let bounds_seat = target.getBoundingClientRect();
        let bounds_sitter = this.sitter.getBoundingClientRect();

        let posX = window.scrollX + bounds_seat.left + bounds_seat.width - bounds_sitter.width - this.sitter_offset_x;
        let posY = window.scrollY + (bounds_seat.top - bounds_sitter.height) + this.sitter_offset_y;

        this.sitter.style.left = posX.toString() + 'px';
        this.sitter.style.top = posY.toString() + 'px';

        this.removeSittingClassFromAll();
        target.classList.add(this.getSittingClass());
    }

    removeSittingClassFromAll() {
        let self = this;
        let elements = document.getElementsByClassName(this.getSittingClass());
        Array.from(elements).forEach(function (element) {
            element.classList.remove(self.getSittingClass());
        });
    }
    getSittingClass() {
        return this.seat_class + '_sitting';
    }
    createSitter() {
        this.sitter = document.createElement("img");
        this.setSitterImage();
        this.sitter.classList.add(this.sitter_class);
        this.sitter.style.position = 'absolute';
        this.sitter.style.display = 'none';
        this.sitter.style.zIndex = '10000';
        document.body.appendChild(this.sitter);
    }
    setSitterImage() {
        this.sitter.setAttribute("src", this.getRandomSitterImage());
    }

    getRandomSitterImage() {
        return this.sitter_images[Math.floor(Math.random() * this.sitter_images.length)];
    }
}