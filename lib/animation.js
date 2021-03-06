'use strict';

const Panel = require('./panel');

module.exports = class Animation
{
	constructor(data)
	{
		data = data || {};
		Object.assign(this, data);
		this.panels = {};
		if (data.animData) this.unpackPanels(data.animData);

		this.loop = this.loop || false;
		this.version = this.version || '1.0';
		this.animName = this.animName || 'unnamed';
		this.animType = this.animType || 'static';
	}

	unpackPanels(animData)
	{
		// animData structure:
		// panel count
		// for each panel: panel id, frame count
		// for each frame: r, g, b, w, transition time

		const ints = animData.split(' ').map(d => Number(d));
		this.panelcount = ints.shift();

		for (var i = 0; i < this.panelcount; i++)
		{
			const p = new Panel(ints.shift());
			const count = ints.shift();
			for (var j = 0; j < count; j++)
			{
				p.frames.push({
					r: ints.shift(),
					g: ints.shift(),
					b: ints.shift(),
					w: ints.shift(),
					transition: ints.shift(),
				});
			}

			this.panels[p.id] = p;
		}
	}

	serialize()
	{
		const panelIDs = Object.keys(this.panels).sort();
		const result = {
			animName: this.animName,
			loop: this.loop,
			animType: this.animType,
			version: this.version,
			animData: `${panelIDs.length}`,
		};

		panelIDs.forEach(k =>
		{
			const p = this.panels[k];
			result.animData += ' ' + p.serialize();
		});

		return result;
	}
};
