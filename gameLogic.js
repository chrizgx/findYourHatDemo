/* Game Configuration */

export const hat = 'H';
export const hole = 'O';
export const fieldCharacter = '';
export const pathCharacter = 'X';

/* Game Logic */

export class Field {
    constructor(field, virtual=false) {
        this.field = field;
        this.location = {x: 0, y: 0};
        this.virtual = virtual;
    }

    print() {
        let output = '';

        for (let y = 0; y < this.field.length; y++) {
            for (let x = 0; x < this.field[y].length; x++) {
                output += this.field[y][x];
            }
            output += '\n';
        }
        return output;
    }

    updateLocation(move) {
        switch (move) {
            case 'ArrowUp':
                this.location.y--;
                break;
            case 'ArrowRight':
                this.location.x++;
                break;
            case 'ArrowDown':
                this.location.y++;
                break;
            case 'ArrowLeft':
                this.location.x--;
                break;
            default:
                break;
        }
    }

    locationIsValid() {
        let x = this.location.x;
        let y = this.location.y;
        return !(x < 0 || x >= this.field[0].length || y < 0 || y >= this.field.length);
    }

    getLocationLand() {
        return this.field[this.location.y][this.location.x];
    }

    getLocationLandName() {
        if (!this.locationIsValid()) {
            return 'outside'
        }

        switch (this.getLocationLand()) {
            case hat: return 'hat';
            case hole: return 'hole';
            case fieldCharacter: return 'available';
            //case pathCharacter: return 'unavailable';
        }
    }

    updateLocationLand(land) {
        this.field[this.location.y][this.location.x] = land;
        if (!this.virtual) {
            document.getElementById(`${this.location.y}_${this.location.x}`).innerText = land;
        }
    }

    static fieldGenerator(length) {
        let fieldEmpty = []

        /* Build Basic Template */
        for (let i = 0; i < length; i++) {
            let row = [];
            for (let j = 0; j < length; j++) {
                row.push(fieldCharacter);
            }
            fieldEmpty.push(row);
        }

        const template = new Field(fieldEmpty, true);

        //console.log('Empty grid\n' + template.print());

        template.field[0][0] = 'X';
        template.field[length-1][length-1] = '^';

        //console.log('Base Elements\n' + template.print());

        /* Build one possible solution */

        let xRemaining = length - 1; //Track progress and prevent path from exiting the borders
        let yRemaining = length - 1;

        while (xRemaining + yRemaining !== 0) {
            const x = Math.floor(Math.random() * 3);
            if (xRemaining - x >= 0) {
                for (let i = 0; i < x; i++) {
                    template.updateLocation('ArrowRight');
                    template.updateLocationLand(pathCharacter);
                    xRemaining--;
                }
            }
            const y = Math.floor(Math.random() * 3);
            if (yRemaining - y >= 0) {
                for (let i = 0; i < y; i++) {
                    template.updateLocation('ArrowDown');
                    template.updateLocationLand(pathCharacter);
                    yRemaining--;
                }
            }
        }

        //console.log('Path Written\n' + template.print());

        /* Create holes while keeping clear the solution path */

        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                if (Math.floor(Math.random() * 16) > 8 && template.field[i][j] !== pathCharacter) {
                    template.field[i][j] = hole;
                }
            }
        }

        //console.log('Holes Created\n' + template.print());

        /* Remove the path track from the field */

        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                if (template.field[i][j] === pathCharacter) {
                    template.field[i][j] = fieldCharacter;
                }
            }
        }

        //console.log('Path Removed\n' + template.print());

        /* Set Up the 'X' and hat character */

        template.field[0][0] = pathCharacter;
        template.field[length - 1][length - 1] = hat;

        return template.field;
    }
}