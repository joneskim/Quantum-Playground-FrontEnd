class Complex {
    constructor(real = 0, imag = 0) {
        this.real = real;
        this.imag = imag;
    }

    add(other) {
        return new Complex(
            this.real + other.real,
            this.imag + other.imag
        );
    }

    subtract(other) {
        return new Complex(
            this.real - other.real,
            this.imag - other.imag
        );
    }

    multiply(other) {
        return new Complex(
            this.real * other.real - this.imag * other.imag,
            this.real * other.imag + this.imag * other.real
        );
    }

    divide(other) {
        const denominator = other.real * other.real + other.imag * other.imag;
        return new Complex(
            (this.real * other.real + this.imag * other.imag) / denominator,
            (this.imag * other.real - this.real * other.imag) / denominator
        );
    }

    conjugate() {
        return new Complex(this.real, -this.imag);
    }

    magnitude() {
        return Math.sqrt(this.real * this.real + this.imag * this.imag);
    }

    phase() {
        return Math.atan2(this.imag, this.real);
    }

    toString() {
        if (this.imag === 0) return `${this.real}`;
        if (this.real === 0) return `${this.imag}i`;
        if (this.imag < 0) return `${this.real}${this.imag}i`;
        return `${this.real}+${this.imag}i`;
    }

    static fromPolar(r, theta) {
        return new Complex(
            r * Math.cos(theta),
            r * Math.sin(theta)
        );
    }
}

export default Complex;