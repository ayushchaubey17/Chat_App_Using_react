import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"


const ConfirmDeleteDialog = ({open,handleClose,deleteHandler}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are You Sure Want to delete this Group? Please Confirm!
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>
                No
            </Button>
            <Button color="error" onClick={deleteHandler}>
                yes
            </Button>
        </DialogActions>
    </Dialog>
  )
}



export default ConfirmDeleteDialog

