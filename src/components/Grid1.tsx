import React, { Component } from 'react';

import 'jquery';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';
import 'jquery-ui/ui/widgets/sortable';

import { Column, Formatters, GridOption } from '@slickgrid-universal/common';
import {
  Slicker,
  SlickVanillaGridBundle
} from '@slickgrid-universal/vanilla-bundle';
import { ExampleGridOptions } from './example-grid-options';

// use any of the Styling Theme
// import '../material-styles.scss';
import './styles.scss';

interface Props {}
interface State {}

export default class Grid1 extends Component<Props, State> {
  state = {};

  gridOptions1: GridOption;
  columnDefinitions1: Column[];
  dataset1: any[];
  sgb1: SlickVanillaGridBundle;

  NB_ITEMS = 995;

  mockData = (count: number) => {
    const mockDataset = [];
    for (let i = 0; i < count; i++) {
      const randomYear = 2010 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor(Math.random() * 29);
      const randomPercent = Math.round(Math.random() * 100);

      mockDataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        start: new Date(randomYear, randomMonth + 1, randomDay),
        finish: new Date(randomYear + 1, randomMonth + 1, randomDay),
        effortDriven: i % 5 === 0
      };
    }

    return mockDataset;
  };

  defineGrids = () => {
    this.columnDefinitions1 = [
      {
        id: 'title',
        name: 'Title',
        field: 'title',
        sortable: true,
        minWidth: 100,
        filterable: true
      },
      {
        id: 'duration',
        name: 'Duration (days)',
        field: 'duration',
        sortable: true,
        minWidth: 100,
        filterable: true
      },
      {
        id: '%',
        name: '% Complete',
        field: 'percentComplete',
        sortable: true,
        minWidth: 100,
        filterable: true
      },
      {
        id: 'start',
        name: 'Start',
        field: 'start',
        formatter: Formatters.dateIso,
        exportWithFormatter: true,
        filterable: true
      },
      {
        id: 'finish',
        name: 'Finish',
        field: 'finish',
        formatter: Formatters.dateIso,
        exportWithFormatter: true,
        filterable: true
      },
      {
        id: 'effort-driven',
        name: 'Effort Driven',
        field: 'effortDriven',
        sortable: true,
        minWidth: 100,
        filterable: true
      }
    ];
    this.gridOptions1 = {
      enableAutoResize: false,
      gridHeight: 225,
      gridWidth: 800,
      rowHeight: 33
    };
  };

  componentDidMount() {
    this.defineGrids();
    this.dataset1 = this.mockData(this.NB_ITEMS);
    this.sgb1 = new Slicker.GridBundle(
      document.querySelector<HTMLDivElement>(`.grid1`),
      this.columnDefinitions1,
      { ...ExampleGridOptions, ...this.gridOptions1 },
      this.dataset1
    );
    console.log('gridOptions1: ', this.gridOptions1);
    console.log(this.dataset1);
  }

  componentWillUnmount() {
    this.sgb1?.dispose();
  }

  render() {
    return (
      <div>
        <h3>Grid Sample 1</h3>
        <div className="grid1"></div>
      </div>
    );
  }
}
