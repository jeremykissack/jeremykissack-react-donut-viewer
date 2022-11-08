import React from "react";

class Donut extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            A: 0,   // Primary rotation axis
            B: 0,   // Secondary rotation axis
            Z: 5,   // Distance (zoom level)
            Spin: false // Animated rotation
        }

        // Button Bindings
        this.handleUpClick = this.handleUpClick.bind(this)
        this.handleDnClick = this.handleDnClick.bind(this)
        this.handleLeftClick = this.handleLeftClick.bind(this)
        this.handleRightClick = this.handleRightClick.bind(this)
        this.handleInClick = this.handleInClick.bind(this)
        this.handleOutClick = this.handleOutClick.bind(this)
        this.handleSpinClick = this.handleSpinClick.bind(this)
        this.spin = this.spin.bind(this)
    }

    // State Control Functions
    handleUpClick(){
        this.setState({A: this.state.A + 0.1})
    }
    handleDnClick(){
        this.setState({A: this.state.A - 0.1})
    }
    handleLeftClick(){
        this.setState({B: this.state.B + 0.1})
    }
    handleRightClick(){
        this.setState({B: this.state.B - 0.1})
    }
    handleInClick(){
        this.setState({Z: this.state.Z - 0.25})
    }
    handleOutClick(){
        this.setState({Z: this.state.Z + 0.25})
    }

    // Animation toggle
    handleSpinClick(){
        if (!this.state.Spin) {
            this.startSpin();
        }
        else {
            this.stopSpin();
        }
    }

    spin() { // Increments rotation axis, then renders the frame
        this.setState({A: this.state.A + 0.025, B: this.state.B + 0.015});
        this.asciiFrame();
    }

    startSpin() { //start animation using interval
        console.log("Start Spin")
        this.setState({Spin: true})
        this.intervalId = setInterval(this.spin, 16); // 16ms period ~ 60Hz refresh rate
        }

    stopSpin() { //stop animation by clearing interval
        console.log("Stop Spin")
        this.setState({Spin: false})
        clearInterval(this.intervalId);
    }

    render(){

        const frame = this.asciiFrame(); //rendered ascii characters
        
        // Pause / Play button visual logic
        let spinButton;
        if (this.state.Spin) {
            spinButton = <button className="item7" onClick={this.handleSpinClick}>|  |</button>
        }
        else {
            spinButton = <button className="item7" onClick={this.handleSpinClick}>⟳</button>
        }


        return (
            <div>
                <h1 className="Header">donutViewer</h1>
                    <div className="ascii">
                        <pre>{frame}</pre>
                    </div>
                <footer className="footer">
                    <div className="buttons">
                        <button className="item1" onClick={this.handleInClick}>+</button>
                        <button className="item2" onClick={this.handleUpClick}>↑</button>
                        <button className="item3" onClick={this.handleOutClick}>-</button>
                        <button className="item4" onClick={this.handleLeftClick}>←</button>
                        <button className="item5" onClick={this.handleDnClick}>↓</button>
                        <button className="item6" onClick={this.handleRightClick}>→</button>
                        {spinButton}
                    </div>
                </footer>
            </div>
        );
    }


    //Frame rendering algorithm based off of these sources, but modified to be controllable:
    //https://www.a1k0n.net/2011/07/20/donut-math.html
    //https://github.com/lijitin/ascii_donut

    asciiFrame() {
        var A = this.state.A, B = this.state.B, Z = this.state.Z; // State variables
        var b=[]; // Ascii array
        var z=[]; // Pixel distance array
        var i; //phi donut revolution

        // Pre-compute sins / cos's for each axis
        var cA=Math.cos(A), sA=Math.sin(A),
            cB=Math.cos(B), sB=Math.sin(B);

        // Initialize arrays   
        for(var k=0;k<1760;k++) {
            b[k]=k%80 === 79 ? "\n" : " "; // space or carriage return to start off blank
            z[k]=0; // minimum value for z because no object rendered yet
        }
        for(var j=0;j<6.28;j+=0.07) { // j <=> theta rotation
            var ct=Math.cos(j),st=Math.sin(j);

            for(i=0;i<6.28;i+=0.02) {   // i <=> phi rotation
                var sp=Math.sin(i),cp=Math.cos(i),
                    h=ct+2, // R1 + R2*cos(theta)
                    D=1/(sp*h*sA+st*cA+Z), // this is 1/z (distance)
                    t=sp*h*cA-st*sA; // this is a clever factoring of some of the terms in x' and y'

                var x=0|(40+30*D*(cp*h*cB-t*sB)), // X position
                    y=0|(12+15*D*(cp*h*sB+t*cB)), // Y position
                    o=x+80*y, // XY serialization
                    N=0|(8*((st*sA-sp*ct*cA)*cB-sp*ct*sA-st*cA-cp*ct*sB)); // Luminance

                if(y<22 && y>=0 && x>=0 && x<79 && D>z[o]) {
                    z[o]=D; // Distance
                    b[o]=".,-~:;=!*#$@"[N>0?N:0]; // Assign luminance to ASCII
                }
            }
        }
        return b.join(""); // Return string of ASCII
    }

}

export default Donut;