'use client';

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Product Name', width: 200 },
  { field: 'price', headerName: 'Price ($)', width: 130 },
  { field: 'stock', headerName: 'In Stock', width: 120 },
];

const rows = [
  { id: 1, name: 'Widget A', price: 29.99, stock: 120 },
  { id: 2, name: 'Widget B', price: 19.99, stock: 80 },
  { id: 3, name: 'Widget C', price: 49.99, stock: 45 },
];

export default function ProductTable() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
}
