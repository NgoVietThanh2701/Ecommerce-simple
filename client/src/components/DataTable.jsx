import { DataGrid } from '@mui/x-data-grid';

const DataTable = ({ rows, columns, height }) => {

   return (
      <DataGrid
         autoHeight
         rows={rows}
         columns={columns}
         getRowId={(row) => row.uid}
         getRowHeight={() => height ?? 100}
         initialState={{
            pagination: {
               paginationModel: { pageSize: 4, page: 0 },
            }
         }}
         pageSizeOptions={[4]}
      />
   )
}

export default DataTable