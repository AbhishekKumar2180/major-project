import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { Search, Trash, UserPlus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import GlobalApi from '@/app/_services/GlobalApi';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

const pagination = true;
const paginationPageSize = 10;
const paginationPageSizeSelector = [10, 25, 50, 100];

function StudentListTable({ studentList, refreshData }) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const CustomButtons = (props) => {
        return (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost" className='hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all rounded-xl'>
                        <Trash size={18} />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className='glass-morphism rounded-[2rem] border-border'>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-2xl font-black'>Critical Action</AlertDialogTitle>
                        <AlertDialogDescription className='text-muted-foreground font-medium'>
                            This will permanently remove <span className='text-foreground font-bold'>"{props?.data?.name}"</span> from the institution's registry. This operation cannot be reversed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='gap-3 mt-6'>
                        <AlertDialogCancel className='rounded-2xl border-border bg-muted/50 font-bold'>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => DeleteRecord(props?.data?.id)}
                            className='rounded-2xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-black uppercase tracking-widest text-[10px]'
                        >
                            Confirm Deletion
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    const [colDefs, setColDefs] = useState([
        { 
            field: "id", 
            headerName: "ID",
            filter: true, 
            width: 100,
            cellClass: 'font-mono text-[10px] uppercase font-bold text-primary'
        },
        { 
            field: "name", 
            headerName: "Full Name",
            filter: true, 
            flex: 1,
            cellClass: 'font-black text-foreground'
        },
        { 
            field: "grade", 
            headerName: "Cohort",
            filter: true, 
            width: 120,
            cellClass: 'font-bold text-muted-foreground uppercase text-[10px]'
        },
        { 
            field: "contact", 
            headerName: "Contact",
            filter: true, 
            width: 150 
        },
        { 
            field: "address", 
            headerName: "Location",
            filter: true, 
            flex: 1.5 
        },
        { 
            field: 'action', 
            headerName: 'Actions',
            cellRenderer: CustomButtons,
            width: 100,
            pinned: 'right',
            sortable: false,
            filter: false
        }
    ])

    const [rowData, setRowData] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        if (studentList) {
            setRowData(studentList);
        }
    }, [studentList]);

    const DeleteRecord = (id) => {
        GlobalApi.DeleteStudentRecord(id).then(resp => {
            if (resp) {
                toast.success('Record purged successfully')
                refreshData()
            }
        }).catch(err => {
            console.error(err);
            toast.error("Security policy violation: Failed to delete record.");
        })
    }

    if (!mounted) return null;

    return (
        <div className='bg-card rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 overflow-hidden transition-all duration-500'>
            <div className='p-8 border-b border-border/50 flex flex-col md:flex-row justify-between items-center bg-muted/20 backdrop-blur-xl gap-6'>
                <div className='flex items-center gap-4'>
                    <div className='p-3 bg-primary/10 text-primary rounded-2xl'>
                        <UserPlus size={24} />
                    </div>
                    <div>
                        <h3 className='font-black text-2xl text-foreground tracking-tight uppercase'>Registry <span className='text-primary'>Intelligence</span></h3>
                        <p className='text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1'>Operational Cohort Database</p>
                    </div>
                </div>

                <div className='flex gap-3 w-full md:max-w-md'>
                    <div className='relative flex-1 group'>
                        <div className='absolute inset-y-0 left-5 flex items-center pointer-events-none'>
                            <Search className='text-muted-foreground group-focus-within:text-primary transition-colors' size={18} />
                        </div>
                        <input
                            type='text'
                            placeholder='Filter operational records...'
                            className='w-full pl-12 pr-5 py-4 rounded-2xl bg-background border border-border outline-none text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-muted-foreground/50'
                            onChange={(event) => setSearchInput(event.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" className='rounded-2xl p-7 border-border hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all'>
                        <Filter size={20} />
                    </Button>
                </div>
            </div>

            <div
                className={`${theme === 'dark' ? 'ag-theme-quartz-dark' : 'ag-theme-quartz'} p-6 transition-all duration-500`}
                style={{ height: 600 }}
            >
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    quickFilterText={searchInput}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    gridOptions={{
                        headerHeight: 64,
                        rowHeight: 64,
                        animateRows: true,
                        overlayNoRowsTemplate: '<span class="font-black text-muted-foreground uppercase tracking-widest text-[10px]">No active records found in local node</span>'
                    }}
                />
            </div>
            <style jsx global>{`
                .ag-theme-quartz, .ag-theme-quartz-dark {
                    --ag-border-radius: 20px;
                    --ag-header-column-separator-display: none;
                    --ag-font-family: 'Inter', sans-serif;
                    --ag-header-background-color: transparent;
                    --ag-header-foreground-color: hsl(var(--muted-foreground));
                    --ag-row-hover-color: hsl(var(--primary) / 0.03);
                    --ag-selected-row-background-color: hsl(var(--primary) / 0.08);
                    --ag-row-border-color: hsl(var(--border) / 0.4);
                }
                .ag-header-cell-label { 
                    font-weight: 900; 
                    text-transform: uppercase; 
                    font-size: 11px; 
                    letter-spacing: 0.1em;
                }
                .ag-cell {
                    display: flex;
                    align-items: center;
                    font-size: 13px;
                    color: hsl(var(--foreground));
                }
                .ag-header {
                    border-bottom: 2px solid hsl(var(--border) / 0.5) !important;
                }
            `}</style>
        </div>
    )
}

export default StudentListTable