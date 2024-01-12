import { h, render, Component } from "preact";

const refreshRate = 1000;

class TrafficLog extends Component {
	constructor() {
		super();
		this.state = { content: "" };
	}

	componentDidMount() {
		this.intervalSetter = setInterval(async () => {
			var log = await (await fetch("trafficLog")).text();
			this.setState({ content: log });
		}, refreshRate);
	}

	componentWillUnmount() {
		clearInterval(this.intervalSetter);
	}

	render() {
		const contentWithLineBreaks = this.state.content
			.split("\n")
			.map((line, _) => {
				return (
					<span>
						{line}
						<br />
					</span>
				);
			});

		return <span>{contentWithLineBreaks}</span>;
	}
}

render(<TrafficLog />, document.getElementById("traffic-log"));
