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

export default class Grid1b extends Component<Props, State> {
  state = {};

  gridOptions2: GridOption;
  columnDefinitions2: Column[];
  dataset2: any[];
  sgb2: SlickVanillaGridBundle;
  isGrid2WithPagination = true;

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
    this.columnDefinitions2 = [
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
    this.gridOptions2 = {
      enableAutoResize: false,
      gridHeight: 255,
      gridWidth: 800,
      rowHeight: 33,
      enablePagination: true,
      enableFiltering: true,
      pagination: {
        pageSizes: [5, 10, 15, 20, 25, 50, 75, 100],
        pageSize: 5
      },
      presets: {
        pagination: {
          pageNumber: 2,
          pageSize: 5
        },
        sorters: [
          // { columnId: '%', direction: 'DESC' },
          { columnId: 'title', direction: 'ASC' }
        ],
        filters: [{ columnId: 'title', searchTerms: ['2'] }]
      }
    };
  };

  // Toggle the Pagination of Grid2
  // IMPORTANT, the Pagination MUST BE CREATED on initial page load before you can start toggling it
  // Basically you cannot toggle a Pagination that doesn't exist (must created at the time as the grid)
  togglePaginationGrid2 = () => {
    console.log('togglePaginationGrid2', this.isGrid2WithPagination);
    this.isGrid2WithPagination = !this.isGrid2WithPagination;
    this.sgb2.paginationService?.togglePaginationVisibility(
      this.isGrid2WithPagination
    );
  };

  componentDidUpdate() {
    console.log('Component is updated');
  }

  componentDidMount() {
    this.defineGrids();
    this.dataset2 = this.mockData(this.NB_ITEMS);
    this.sgb2 = new Slicker.GridBundle(
      document.querySelector<HTMLDivElement>(`.grid2`),
      this.columnDefinitions2,
      { ...ExampleGridOptions, ...this.gridOptions2 },
      this.dataset2
    );
    console.log('gridOptions2: ', this.gridOptions2);
    console.log(this.dataset2);
  }

  componentWillUnmount() {
    this.sgb2?.dispose();
  }

  render() {
    return (
      <div>
        <h3>Grid Sample 2</h3>
        <div className="grid2"></div>
      </div>
    );
  }
}
