import { 
  Text, 
  View,
  DeviceEventEmitter,
  NativeEventEmitter,
  PermissionsAndroid,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Button, 
  FlatList} from 'react-native'
import React, { Component, useState, useEffect, useCallback, useContext } from 'react'
import {BluetoothManager} from 'react-native-bluetooth-escpos-printer';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import { css_global } from './../style/StyleGlobal';
import ItemList from './../component/ItemList';

import { AppContext } from './../context/AppContext';

export default function BlueTootPage (){
  const global_state_contexst = useContext(AppContext)

  const [pairedDevices, setPairedDevices] = useState([]);
  const [foundDs, setFoundDs] = useState([]);
  const [bleOpend, setBleOpend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [boundAddress, setBoundAddress] = useState('');

  const cobaAllPrint = [
    {
      id : 1,
      name :"adfdasf",
      address : "malang1"
    },
    {
      id : 2,
      name :"DUA",
      address : "malang2"
    },
    {
      id : 3,
      name :"tiga",
      address : "malang3"
    },
    {
      id : 4,
      name :"empat",
      address : "malan4"
    },
    {
      id : 5,
      name :"lima",
      address : "malang5"
    },
    {
      id : 6,
      name :"enam",
      address : "malang6"
    },
    {
      id : 7,
      name :"tuju",
      address : "malang7"
    },
    {
      id : 8,
      name :"delapan",
      address : "malang8"
    },
    {
      id : 9,
      name :"semlian",
      address : "malang9"
    },
    {
      id : 10,
      name :"sepuluh",
      address : "malang10"
    }
  ]

  useEffect(() => {
    BluetoothManager.isBluetoothEnabled().then(
      enabled => {
        setBleOpend(Boolean(enabled));
        setLoading(false);
        global_state_contexst.setDataBlueTooth({bluetooth_is_on : Boolean(enabled)})
      },
      err => {
        err;
      },
    );
  
    if (Platform.OS === 'android') {
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
          rsp => {
            deviceAlreadPaired(rsp);
          },
        );
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_FOUND,
          rsp => {
            deviceFoundEvent(rsp);
          },
        );
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_CONNECTION_LOST,
          () => {
            setName('');
            setBoundAddress('');
            global_state_contexst.setListBlueToothConnect({bluetooth_connect_context : ""})
          },
        );
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
          () => {
            ToastAndroid.show(
              'Device Not Support Bluetooth !',
              ToastAndroid.LONG,
            );
          },
        );
    }
    
    if(pairedDevices.length < 1) {
        scan();
    }
  }, [boundAddress, deviceAlreadPaired, deviceFoundEvent, pairedDevices, scan])

  const deviceAlreadPaired = useCallback(
    rsp => {
      var ds = null;
      if (typeof rsp.devices === 'object') {
        ds = rsp.devices;
      } else {
        try {
          ds = JSON.parse(rsp.devices);
        } catch (e) {}
      }
      if (ds && ds.length) {
        let pared = pairedDevices;
        if (pared.length < 1) {
          pared = pared.concat(ds || []);
        }
        setPairedDevices(pared);
      }
    },
    [pairedDevices],
  );

  const deviceFoundEvent = useCallback(
    rsp => {
      var r = null;
      try {
        if (typeof rsp.device === 'object') {
          r = rsp.device;
        } else {
          r = JSON.parse(rsp.device);
        }
      } catch (e) {
        // ignore error
      }

      if (r) {
        let found = foundDs || [];
        if (found.findIndex) {
          let duplicated = found.findIndex(function (x) {
            return x.address == r.address;
          });
          if (duplicated == -1) {
            found.push(r);
            setFoundDs(found);
          }
        }
      }
    },
    [foundDs],
  );

  const connectToPrint = row => {
    setLoading(true);
    BluetoothManager.connect(row.address).then(
      s => {
        setLoading(false);
        setBoundAddress(row.address);
        global_state_contexst.setListBlueToothConnect({bluetooth_connect_context : row.address})
        setName(row.name || 'UNKNOWN');
        console.log('sukses connect to print');
      },
      e => {
        setLoading(false);
        console.log('Error connect print',e);
        alert(e);
      },
    );
  };

  const unPair = address => {
    setLoading(true);
    BluetoothManager.unpaire(address).then(
      s => {
        setLoading(false);
        setBoundAddress('');
        global_state_contexst.setListBlueToothConnect({bluetooth_connect_context : ""})
        setName('');
      },
      e => {
        setLoading(false);
        alert(e);
      },
    );
  };


  const scanDevices = useCallback(() => {
    setLoading(true);
    BluetoothManager.scanDevices().then(
      s => {
        // const pairedDevices = s.paired;
        var found = s.found;
        try {
          found = JSON.parse(found); //@FIX_it: the parse action too weired..
        } catch (e) {
          //ignore
        }
        var fds = foundDs;
        if (found && found.length) {
          fds = found;
        }
        setFoundDs(fds);
        setLoading(false);
      },
      er => {
        setLoading(false);
        // ignore
      },
    );
  }, [foundDs]);

  const scan = useCallback(() => {
    try {
      async function blueTooth() {
        const permissions = {
          title: 'HSD bluetooth meminta izin untuk mengakses bluetooth',
          message:
            'HSD bluetooth memerlukan akses ke bluetooth untuk proses koneksi ke bluetooth printer',
          buttonNeutral: 'Lain Waktu',
          buttonNegative: 'Tidak',
          buttonPositive: 'Boleh',
        };

        const bluetoothConnectGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          permissions,
        );
        if (bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED) {
          const bluetoothScanGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            permissions,
          );
          if (bluetoothScanGranted === PermissionsAndroid.RESULTS.GRANTED) {
            scanDevices();
          }
        } else {
          // ignore akses ditolak
        }
      }
      blueTooth();
    } catch (err) {
      console.warn(err);
    }
  }, [scanDevices]);

  const scanBluetoothDevice = async () => {
    setLoading(true);
    try {
      const request = await requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]);

      if (
        request['android.permission.ACCESS_FINE_LOCATION'] === RESULTS.GRANTED
      ) {
        scanDevices();
        setLoading(false);
      } else {
        setLoading(false);
      }
      console.log('scan',pairedDevices);
    } catch (err) {
      setLoading(false);
      console.log('error scan',err);
    }
  };

  const  renderListBluetootConnect =({item, index}) => {
      return(
        <ItemList
          key={index}
          onPress={() => connectToPrint(item)}
          label={item.name}
          value={item.address}
          connected={item.address === boundAddress}
          actionText="Hubungkan"
          color="#00BCD4"
        />
      );
  }
  

    return (
      <View style={styles.container}>
        <Button  onPress={() => scanBluetoothDevice()} title="Scan Bluetooth" />
        <View style={styles.bluetoothStatusContainer}>
          <Text style={styles.bluetoothStatus(bleOpend ? '#47BF34' : '#A8A9AA')}>
            Bluetooth {bleOpend ? 'Aktif' : 'Non Aktif'}
          </Text>
        </View>
        <Text style={styles.sectionTitle}>
          Printer yang terhubung ke aplikasi:
        </Text>
        {boundAddress.length > 0 && (
          <ItemList
            label={name}
            value={boundAddress}
            onPress={() => unPair(boundAddress)}
            actionText="Putus"
            color="#E9493F"
          />
        )}
      {boundAddress.length < 1 && (
        <Text style={styles.printerInfo}>Belum ada printer yang terhubung</Text>
      )}
       <Text style={styles.sectionTitle}>
        Bluetooth yang terhubung ke HP ini:
      </Text>
      {loading ? <ActivityIndicator animating={true} /> : null}
      <View style={styles.containerList}> 
        {/* pairedDevices */}
        {/* {pairedDevices.map((item, index) => {
          return (
            <ItemList
              key={index}
              onPress={() => connectToPrint(item)}
              label={item.name}
              value={item.address}
              connected={item.address === boundAddress}
              actionText="Hubungkan"
              color="#00BCD4"
            />
          );
        })} */}
        {
           <FlatList
           data={pairedDevices}
           renderItem={renderListBluetootConnect}
           keyExtractor={item => `${item.address}`}
           />
        }
      </View>
     
      </View>
    )
  
}


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  containerList: { flex: 1, flexDirection: 'column',marginBottom:100 },
  bluetoothStatusContainer: { justifyContent: 'flex-end', alignSelf: 'flex-end',marginTop:10 },
  bluetoothStatus: color => ({
    backgroundColor: color,
    padding: 8,
    borderRadius: 2,
    color: 'white',
    paddingHorizontal: 14,
    marginBottom: 20,
  }),
  bluetoothInfo: { textAlign: 'center', fontSize: 16, color: '#FFC806', marginBottom: 20 },
  sectionTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 12,color:'black' },
  printerInfo: { textAlign: 'center', fontSize: 16, color: '#E9493F', marginBottom: 20 },
});
