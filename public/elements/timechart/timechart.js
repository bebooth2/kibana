import React from 'react';
import _ from 'lodash';
import Element from 'plugins/rework/elements/element';
import elements from 'plugins/rework/elements/elements';
import Dataframe from 'plugins/rework/arg_types/dataframe/lib/dataframe';
import { Timeseries } from '@elastic/thor-visualizations';
import '@elastic/thor-visualizations/css/main.css';
import './timechart.less';

import moment from 'moment';

import Arg from 'plugins/rework/arg_types/arg';

elements.push(new Element('timechart', {
  displayName: 'Time Chart',
  args: [
    new Arg('dataframe', {
      type: 'dataframe',
      default: (state) => _.keys(state.transient.dataframeCache)[0]
    })
  ],
  template: ({args}) => {
    const dataframe = new Dataframe(args.dataframe);

    if (!dataframe.rows.length) return (<div>Waiting...</div>);

    const groups = _.groupBy(dataframe.rows, (row) => row.named.label.value);

    const series = _.map(groups, (rows, label) => {
      return {
        color: '#6EDBFF',
        stack: true,
        lines: { show: true, lineWidth: 1, fill: 0.5 },
        points: { show: true, lineWidth: 1, radius: 1, fill: 1 },
        label: label,
        data: _.map(rows, (row) => {
          return [moment(row.named.timestamp.value).valueOf(), row.named.value.value];
        })
      };
    });

    const props = {
      //crosshair: true,
      //tickFormatter: formatter,
      legendPosition: args.legend_position || 'right',
      series,
      legend: true,
      /*
      onBrush: (ranges) => {
        const link = {
          path: location.path,
          query: _.assign({}, location.query, {
            mode: 'absolute',
            from: moment(ranges.xaxis.from).valueOf(),
            to: moment(ranges.xaxis.to).valueOf()
          })
        };
        dispatch(changeLocation(link));
      }
      */
    };

    return (
      <div className="rework--timechart">
        <Timeseries {...props}></Timeseries>
      </div>
    );
  }
}));
