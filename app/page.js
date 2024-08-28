'use client';

import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, Modal, TextField, IconButton, Card, CardContent, CardActions, CircularProgress, Snackbar, Fade, Stack, Slide, Zoom } from '@mui/material';
import { Add, Remove, Inventory } from '@mui/icons-material';
import { firestore } from '@/firebase';
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { styled, keyframes } from '@mui/system';

// Animation keyframes
const bounce = keyframes`
  20% { transform: scale(1.1); }
  50% { transform: scale(0.9); }
  80% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Define the style object for the modal box
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '500px',
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  color: theme.palette.getContrastText(theme.palette.primary.main),
  borderRadius: '25px',
  padding: theme.spacing(1, 3),
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  textTransform: 'none',
  transition: 'background 0.3s ease, transform 0.2s ease',
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
    transform: 'scale(1.05)',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  margin: theme.spacing(2),
  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
  borderRadius: '12px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  animation: `${fadeInUp} 0.6s ease-out`,
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
  },
}));

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: '' });

  const updateInventory = async () => {
    setLoading(true);
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach(doc => {
      const data = doc.data();
      inventoryList.push({
        name: doc.id,
        quantity: data.quantity || 0,
      });
    });
    setInventory(inventoryList);
    setLoading(false);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: (quantity || 0) + 1 });
      setFeedback({ open: true, message: `${item} quantity increased` });
    } else {
      await setDoc(docRef, { quantity: 1 });
      setFeedback({ open: true, message: `${item} added to inventory` });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
        setFeedback({ open: true, message: `${item} removed from inventory` });
      } else {
        await setDoc(docRef, { quantity: (quantity || 0) - 1 });
        setFeedback({ open: true, message: `${item} quantity decreased` });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSnackbarClose = () => setFeedback({ ...feedback, open: false });

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      bgcolor="#121212"
      padding={4}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
          style: { backdropFilter: 'blur(8px)' }, // Add blur effect when modal is open
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h5" component="h2" fontWeight={600} color="text.primary">
              Add New Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                InputLabelProps={{ style: { color: '#bbb' } }}
                InputProps={{
                  style: { color: '#fff' },
                }}
              />
              <GradientButton
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </GradientButton>
            </Stack>
          </Box>
        </Fade>
      </Modal>
      <Zoom in={true}>
        <GradientButton
          onClick={handleOpen}
          startIcon={<Add />}
          sx={{ fontSize: '18px', padding: '10px 20px' }}
        >
          Add New Item
        </GradientButton>
      </Zoom>
      <Box borderRadius="12px" width="100%" maxWidth="900px" p={2} bgcolor="rgba(30, 30, 30, 0.8)" boxShadow="0 10px 30px rgba(0,0,0,0.5)">
        <Box
          width="100%"
          height="80px"
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          borderRadius="12px 12px 0 0"
          bgcolor="linear-gradient(45deg, #bb86fc 30%, #03dac6 90%)"
          color="#ffffff"
        >
          <Typography variant={'h4'} fontWeight={700}>
            Inventory Items
          </Typography>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {inventory.map(({ name, quantity }) => (
              <Grid item xs={12} sm={6} md={4} key={name}>
                <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                  <StyledCard>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Inventory sx={{ color: '#bb86fc' }} />
                          <Typography variant="h6" fontWeight={600} color="text.primary">
                            {name.charAt(0).toUpperCase() + name.slice(1)}
                          </Typography>
                        </Stack>
                        <Typography variant="body1" color="text.secondary">
                          Quantity: {quantity}
                        </Typography>
                      </Stack>
                    </CardContent>
                    <CardActions>
                      <Stack direction="row" spacing={2}>
                        <IconButton color="primary" onClick={() => addItem(name)}>
                          <Add sx={{ animation: `${bounce} 0.6s` }} />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => removeItem(name)}>
                          <Remove sx={{ animation: `${bounce} 0.6s` }} />
                        </IconButton>
                      </Stack>
                    </CardActions>
                  </StyledCard>
                </Slide>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={feedback.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
