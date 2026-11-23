import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';
import { useAudioPlayer } from 'expo-audio';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Animated,
  Modal,
  TextInput,
  ScrollView,
  useWindowDimensions,
} from 'react-native';







function PixelCat({ isRunning }: { isRunning: boolean }) {
    const [tailWag, setTailWag] = useState(false);

useEffect(() => {
  if (!isRunning) {
    setTailWag(false);
    return;
  }

  const wag = setInterval(() => {
    setTailWag((old) => !old);
  }, 250);

  return () => clearInterval(wag);
}, [isRunning]);

  const normalPixels = [
    ".O........O.....",
    ".OO......OO.....",
    ".OOOOOOOOOO.....",
    ".OOODDDDOOO.....",
    "KKOOKOOOKOOKK...",
    ".OPOKOOOKOPO....",
    "KKKOOOKOOOKKK...",
    "..OOOOKKKOOOO.....",
    "...OOOOOOO....D.",
    "...DOOOOOOO..D..",
    "...DOOOOOOOO.D..",
    "...DOOOOOOOODD..",
    "...DOOOOOOOOD...",
    "..DDOOOOOOOO....",
    "..DDOOOOOOOO....",
  ];

  



const glassesPixels = [
  ".O........O.....",
    ".OO......OO.....",
    ".RRRROOORRRR....",
    ".ROORDDDROOR....",
    "KROKROOORKORK...",
    ".ROKRRRRRKOR....",
    "RROOROOOROORR...",
    ".KRRRROKORRRRK....",
    "...OOKKKOO....D.",
    "...DOOOOOOO..D..",
    "...DOOOOOOOO.D..",
    "...DOOOOOOOODD..",
    "...DOOOOOOOOD...",
    "..DDOOOOOOOO....",
    "..DDOOOOOOOO....",
  ];

  const waggingTailPixels = [
  "...OOOOOOO.....D",
  "...DOOOOOOO..D..",
  "...DOOOOOOOO.D..",
  "...DOOOOOOOODD..",
  "...DOOOOOOOOD...",
];



  const pixels = isRunning ? glassesPixels : normalPixels;
  const displayedPixels = pixels.map((line, row) => {
  if (!isRunning || !tailWag) return line;

  const chars = line.split('');

  if (row === 8) chars[15] = 'D';
  if (row === 9) chars[14] = ' ';


  return chars.join('');
});

  const palette: Record<string, string> = {
    O: "#F29F05",
    D: "#D98204",
    K: "#000000",
    P: "#FF9EB5",
    M: "#D92323", 
    R: "#9E1414"
     };

  return (
    <View style={{ alignItems: "center", marginLeft: 16 }}>
{displayedPixels.map((line, row) => (        
  <View key={row} style={{ flexDirection: "row" }}>
          {line.split("").map((pixel, col) => (
            <View
              key={col}
              style={{
                width: 7,
                height: 7,
                backgroundColor: palette[pixel],
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}


function ShootingStar({ delay, top, left }: { delay: number; top: number; left: number }) {
  const position = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(position, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.timing(position, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  const translateX = position.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150],
  });

  const translateY = position.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: top,
        left: left,
        width: 45,
        height: 2,
        borderRadius: 2,
        backgroundColor: '#E5D5FF',
        opacity,
        transform: [
          { translateX },
          { translateY },
          { rotate: '35deg' },
        ],
      }}
    />
  );
}


function PixelStar({ top, left, delay, size }: {
  top: number;
  left: number;
  delay: number;
  size: number;
}) {
  const opacity = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000 + delay % 900,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.2,
          duration: 1300 + delay % 700,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        backgroundColor: '#FFFFFF',
        opacity,
      }}
    />
  );
}

export default function App() {
const { width: screenWidth } = useWindowDimensions();
const isPhone = screenWidth < 600;
const [mode, setMode] = useState<'classic' | 'extended'>('classic');
const [showTodo, setShowTodo] = useState(false);
const [tasks, setTasks] = useState<{ id: number; text: string; completed: boolean }[]>([]);
const [newTask, setNewTask] = useState('');
const [catName, setCatName] = useState('');
const [nameInput, setNameInput] = useState('');
const [showRenameModal, setShowRenameModal] = useState(false);
const [showNameScreen, setShowNameScreen] = useState(false);
const [showShortcutScreen, setShowShortcutScreen] = useState(false);
const [showFocusSetup, setShowFocusSetup] = useState(false);
useEffect(() => {
  const loadCatName = async () => {
    try {
const savedName = await AsyncStorage.getItem('catName');
      if (savedName) {
  setCatName(savedName);
  setShowNameScreen(false);
  setShowShortcutScreen(false);
} else {
  setShowNameScreen(true);
  setShowShortcutScreen(false);
}
    } catch (error) {
      console.log('Could not load cat name:', error);
      setShowNameScreen(true);
    }
  };

  loadCatName();
}, []);
const bellPlayer = useAudioPlayer(require('./assets/bell.wav'));
const [timerType, setTimerType] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
const [seconds, setSeconds] = useState(25*60);
const [completedSessions, setCompletedSessions] = useState(0);
const [showBreakPrompt, setShowBreakPrompt] = useState(false);  
const [isRunning, setIsRunning] = useState(false);
 const [sessions, setSessions] = useState(0);
const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);
  

useEffect(() => {
  if (!isRunning) return;

  const timer = setInterval(() => {
    setSeconds((current) => current > 0 ? current - 1 : 0);
  }, 1000);

  return () => clearInterval(timer);
}, [isRunning]);

// Handle what happens when a timer reaches zero
useEffect(() => {
  if (seconds !== 0 || !isRunning) return;

  setIsRunning(false);
    bellPlayer.play();
    deactivatePhoneFocus();

  if (timerType === 'focus') {
  setSessions((old) => old + 1);
  setTotalFocusSeconds((old) =>
    old + (mode === 'classic' ? 25 * 60 : 50 * 60)
  );
  setCompletedSessions((old) => old + 1);
  setShowBreakPrompt(true);
}else {
    // Break finished: return to a fresh focus session
    setTimerType('focus');
    setSeconds(mode === 'classic' ? 25 * 60 : 50 * 60);
  }
}, [seconds, isRunning, timerType, mode]);

const minutes = Math.floor(seconds / 60);
const remainingSeconds = seconds % 60;

const totalHours = Math.floor(totalFocusSeconds / 3600);
const totalMinutes = Math.floor((totalFocusSeconds % 3600) / 60);

// Switch between Classic and Extended modes
const switchMode = (newMode: 'classic' | 'extended') => {
  setIsRunning(false);
  setMode(newMode);
  setTimerType('focus');
  setSeconds(newMode === 'classic' ? 25 * 60 : 50 * 60);
  setShowBreakPrompt(false);
  setCompletedSessions(0);
};
// Run an iPhone Shortcut
const runFocusShortcut = async (shortcutName: string) => {
  try {
    const url = `shortcuts://run-shortcut?name=${encodeURIComponent(shortcutName)}`;
    await Linking.openURL(url);
  } catch (error) {
    console.log('Could not open shortcut:', error);
  }
};

// Activate iPhone Focus mode
const activatePhoneFocus = () => {
  runFocusShortcut('XP MODE ON');
};

// Deactivate iPhone Focus mode
const deactivatePhoneFocus = () => {
  runFocusShortcut('XP MODE OFF');
};

// Start the appropriate break
const startBreak = () => {
  const isLongBreak = completedSessions % 3 === 0;
  const breakType = isLongBreak ? 'longBreak' : 'shortBreak';

  setTimerType(breakType);
  setSeconds(
    mode === 'classic'
      ? (isLongBreak ? 15 : 5) * 60
      : (isLongBreak ? 25 : 10) * 60
  );

  setShowBreakPrompt(false);
  setIsRunning(true);
};

// Reset to a fresh focus session
const resetTimer = () => {
  setIsRunning(false);
  if (timerType === 'focus') {
  deactivatePhoneFocus();
}
  setTimerType('focus');
  setSeconds(mode === 'classic' ? 25 * 60 : 50 * 60);
  setShowBreakPrompt(false);
};

const addTask = () => {
  const trimmedTask = newTask.trim();

  if (!trimmedTask) return;

  setTasks((currentTasks) => [
    ...currentTasks,
    {
      id: Date.now(),
      text: trimmedTask,
      completed: false,
    },
  ]);

  setNewTask('');
};
const saveCatName = async () => {
  const trimmedName = nameInput.trim();

  if (!trimmedName) return;

  try {
    await AsyncStorage.setItem('catName', trimmedName);
   setCatName(trimmedName);
setShowNameScreen(false);
setShowShortcutScreen(true);
  } catch (error) {
    console.log('Could not save cat name:', error);
  }
};
const resetApp = async () => {
  try {
    await AsyncStorage.removeItem('catName');
    setCatName('');
    setNameInput('');
    setShowRenameModal(false);
    setShowShortcutScreen(false);
    setShowNameScreen(true);
  } catch (error) {
    console.log('Could not reset app:', error);
  }
};
const saveRenamedCat = async () => {
  const trimmedName = nameInput.trim();

  if (!trimmedName) return;

  try {
    await AsyncStorage.setItem('catName', trimmedName);
    setCatName(trimmedName);
    setShowRenameModal(false);
  } catch (error) {
    console.log('Could not rename cat:', error);
  }
};
const toggleTask = (id: number) => {
  setTasks((currentTasks) =>
    currentTasks.map((task) =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    )
  );
};

const clearCompletedTasks = () => {
  setTasks((currentTasks) =>
    currentTasks.filter((task) => !task.completed)
  );
};
 
return (
  <SafeAreaView style={styles.container}>

    <PixelStar top={113} left={38} delay={300} size={4} />
<PixelStar top={267} left={310} delay={1700} size={5} />
<PixelStar top={395} left={76} delay={800} size={3} />
<PixelStar top={530} left={278} delay={2200} size={5} />
<PixelStar top={625} left={142} delay={500} size={4} />
<PixelStar top={185} left={225} delay={1300} size={3} />
<PixelStar top={75} left={185} delay={900} size={3} />
<PixelStar top={225} left={115} delay={2400} size={4} />
<PixelStar top={340} left={325} delay={600} size={3} />
<PixelStar top={455} left={190} delay={1900} size={5} />
<PixelStar top={575} left={45} delay={1100} size={3} />
<PixelStar top={690} left={245} delay={2800} size={4} />
    
    <ShootingStar delay={0} top={100} left={30} />
<ShootingStar delay={2500} top={350} left={80} />
<ShootingStar delay={5000} top={550} left={40} />

    <View style={styles.header}>
      <Text style={styles.logo}>✦ XP MODE ✦</Text>
      <Text style={styles.subtitle}>LEVEL UP</Text>
    </View>
    <TouchableOpacity
  style={styles.todoFloatingButton}
  onPress={() => setShowTodo(true)}
>
<Text style={styles.todoFloatingButtonText}>☑</Text>
</TouchableOpacity>

<View style={styles.modeSelector}>
  <TouchableOpacity
    style={[styles.modeButton, mode === 'classic' && styles.selectedMode]}
    onPress={() => switchMode('classic')}
  >
    <Text style={styles.modeText}>CLASSIC</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.modeButton, mode === 'extended' && styles.selectedMode]}
    onPress={() => switchMode('extended')}
  >
    <Text style={styles.modeText}>EXTENDED</Text>
  </TouchableOpacity>
</View>


    <View style={styles.mainSection}>
      
      <View style={styles.focusCircle}>
<TouchableOpacity onPress={() => {
  setNameInput(catName);
  setShowRenameModal(true);
}}>
  <Text style={styles.petName}>{catName.toUpperCase()}</Text>
</TouchableOpacity>
<View style={styles.catContainer}>
<PixelCat isRunning={isRunning && timerType === 'focus'} />
    </View>

<Text style={styles.timerTitle}>
  {timerType === 'focus'
    ? 'TIME TO FOCUS'
    : timerType === 'shortBreak'
    ? 'SHORT BREAK'
    : 'LONG BREAK'}
</Text>
        <Text style={styles.timer}>
          {String(minutes).padStart(2, '0')}:
          {String(remainingSeconds).padStart(2, '0')}
        </Text>

        {!showBreakPrompt && (
  <TouchableOpacity
    style={styles.startButton}
onPress={() => {
  if (!isRunning && timerType === 'focus') {
    activatePhoneFocus();
  }

  if (isRunning && timerType === 'focus') {
    deactivatePhoneFocus();
  }

  setIsRunning(!isRunning);
}}  >
    <Text style={styles.buttonText}>
  {isRunning
    ? 'PAUSE'
    : timerType === 'focus'
    ? 'START FOCUS'
    : timerType === 'shortBreak'
    ? 'RESUME SHORT BREAK'
    : 'RESUME LONG BREAK'}
</Text>
  </TouchableOpacity>
)}

        <TouchableOpacity onPress={resetTimer}>
          <Text style={styles.resetText}>↻ Reset</Text>
        </TouchableOpacity>
        {showBreakPrompt && (
  <View style={{ alignItems: 'center', marginTop: 8 }}>
    <Text style={styles.timerTitle}>
      {completedSessions % 3 === 0
        ? 'YOU EARNED A LONG BREAK!'
        : 'YOU EARNED A SHORT BREAK!'}
    </Text>

    <TouchableOpacity
      style={styles.startButton}
      onPress={startBreak}
    >
      <Text style={styles.buttonText}>
        {completedSessions % 3 === 0
          ? 'START LONG BREAK'
          : 'START SHORT BREAK'}
      </Text>
    </TouchableOpacity>
  </View>
)}
      </View>
    </View>

    <View style={styles.stats}>
  <View style={styles.statBox}>
    <Text style={styles.statNumber}>{sessions}</Text>
    <Text style={styles.statLabel}>SESSIONS</Text>
  </View>

  <View style={styles.statBox}>
    <Text style={styles.statNumber}>
      {totalHours}h {totalMinutes}m
    </Text>
    <Text style={styles.statLabel}>TIME LOCKED IN</Text>
  </View>
</View>

    <Text style={styles.footer}>✦ ONE TASK AT A TIME ✦</Text>
    <TouchableOpacity onPress={resetApp}>
  <Text style={styles.resetText}>↻ RESET APP</Text>
</TouchableOpacity>
  <Modal
  visible={showShortcutScreen}
  animationType="fade"
  onRequestClose={() => setShowShortcutScreen(false)}
>
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.logo}>✦ XP MODE ✦</Text>
      <Text style={styles.subtitle}>CONNECT YOUR IPHONE</Text>
    </View>

    <View style={styles.mainSection}>
      <Text style={styles.todoTitle}>ONE LAST SETUP!</Text>

      <Text style={{ color: '#B8A4D8', textAlign: 'center', marginVertical: 20 }}>
        Install these shortcuts to automatically activate and deactivate
        your iPhone Focus Mode.
      </Text>
<TouchableOpacity
  style={styles.addButton}
  onPress={() => setShowFocusSetup(true)}
>
  <Text style={styles.addButtonText}>SET UP XP MODE FOCUS</Text>
</TouchableOpacity>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => Linking.openURL('https://www.icloud.com/shortcuts/8fe58d176db64c6cbe572b6333ee46ca')}
      >
        <Text style={styles.addButtonText}>INSTALL XP MODE ON</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => Linking.openURL('https://www.icloud.com/shortcuts/7a8bb0ed4884436e84ce9f89c160e709')}
      >
        <Text style={styles.addButtonText}>INSTALL XP MODE OFF</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: '#7A1425', marginTop: 20 }]}
        onPress={() => setShowShortcutScreen(false)}
      >
        <Text style={styles.addButtonText}>CONTINUE TO XP MODE ✦</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setShowShortcutScreen(false)}>
        <Text style={styles.resetText}>I'll do this later</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
</Modal>
 <Modal
  visible={showFocusSetup}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setShowFocusSetup(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.todoBox}>
      <Text style={styles.todoTitle}>✦ SET UP XP MODE ✦</Text>

      <Text style={{ color: '#B8A4D8', textAlign: 'center', marginVertical: 20 }}>
        Create your personal iPhone Focus mode:
      </Text>

      <Text style={{ color: '#FFFFFF', lineHeight: 28 }}>
        1. Open Settings on your iPhone.
        {'\n'}
        2. Tap Focus.
        {'\n'}
        3. Tap the + button.
        {'\n'}
        4. Create a custom Focus named XP MODE.
        {'\n'}
        5. Return to XP Mode and install both shortcuts.
      </Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowFocusSetup(false)}
      >
        <Text style={styles.addButtonText}>GOT IT ✦</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
  <Modal
  visible={showNameScreen}
  animationType="fade"
  onRequestClose={() => {}}
>
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.logo}>✦ XP MODE ✦</Text>
      <Text style={styles.subtitle}>YOUR NEW COMPANION AWAITS</Text>
    </View>

    <View style={styles.mainSection}>
<View style={{ transform: [{ scale: 1.0 }], marginBottom: 12 }}>
  <PixelCat isRunning={false} />
</View>
<Text style={[styles.todoTitle, {
  fontSize: 15,
  letterSpacing: 1.5,
  marginTop: 10,
  marginBottom: 20,
}]}>
  NAME YOUR PIXEL CAT
</Text>
      <TextInput
        style={styles.todoInput}
        placeholder="Enter your cat's name..."
        placeholderTextColor="#8980A8"
        value={nameInput}
        onChangeText={setNameInput}
        maxLength={15}
        onSubmitEditing={saveCatName}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={saveCatName}
      >
        <Text style={styles.addButtonText}>LET'S BEGIN ✦</Text>
      </TouchableOpacity>
      
    </View>
  </SafeAreaView>
</Modal>
<Modal
  visible={showRenameModal}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setShowRenameModal(false)}
>
  <View
  style={[
    styles.modalOverlay,
    isPhone && {
      justifyContent: 'center',
      paddingTop: 20,
    },
  ]}
>
<View
  style={[
    styles.todoBox,
    isPhone && { height: '90%' },
  ]}
>      <Text style={styles.todoTitle}>✦ RENAME YOUR CAT ✦</Text>

      <TextInput
        style={styles.todoInput}
        placeholder="Enter a new name..."
        placeholderTextColor="#8980A8"
        value={nameInput}
        onChangeText={setNameInput}
        maxLength={15}
        autoFocus={true}
        onSubmitEditing={saveRenamedCat}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={saveRenamedCat}
      >
        <Text style={styles.addButtonText}>SAVE NEW NAME</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setShowRenameModal(false)}>
        <Text style={styles.resetText}>CANCEL</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
<Modal
  visible={showTodo}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setShowTodo(false)}
>
  <View
  style={[
    styles.modalOverlay,
    isPhone && {
      justifyContent: 'center',
      paddingTop: 20,
    },
  ]}
>
    <View
  style={[
    styles.todoBox,
    isPhone && { height: '90%' },
  ]}
>
      <View style={styles.todoHeader}>
        <Text style={styles.todoTitle}>✦ MY QUESTS ✦</Text>

        <TouchableOpacity onPress={() => setShowTodo(false)}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.todoInput}
        placeholder="Add a new task..."
        placeholderTextColor="#8980A8"
        value={newTask}
        onChangeText={setNewTask}
        onSubmitEditing={addTask}
      />

      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>+ ADD TASK</Text>
      </TouchableOpacity>

     <ScrollView
  style={styles.taskList}
  contentContainerStyle={{ flexGrow: 0 }}
  showsVerticalScrollIndicator={true}
>
        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskRow}
            onPress={() => toggleTask(task.id)}
          >
            <Text style={styles.taskCheck}>
              {task.completed ? '☑' : '☐'}
            </Text>

            <Text
              style={[
                styles.taskText,
                task.completed && styles.completedTask,
              ]}
            >
              {task.text}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.clearButton}
        onPress={clearCompletedTasks}
      >
        <Text style={styles.clearButtonText}>CLEAR COMPLETED</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
  </SafeAreaView>
);

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050509',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 12,
  },
  todoFloatingButton: {
  position: 'absolute',
  top: 70,
  right: 20,
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: '#8054B8',
  borderWidth: 1,
  borderColor: '#C69AF0',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
},

todoFloatingButtonText: {
  color: '#FFFFFF',
  fontSize: 25,
  fontWeight: 'bold',
},
  logo: {
    color: '#D8B8FF',
    fontSize: 23,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  subtitle: {
    color: '#8980A8',
    marginTop: 7,
    fontSize: 11,
    letterSpacing: 2,
  },
 mainSection: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: 55,
},
modeSelector: {
  flexDirection: 'row',
  justifyContent: 'center',
  gap: 16,
  marginTop: 0,
  transform: [{ translateY: 60 }],
  zIndex: 10,
},

modeButton: {
  borderWidth: 1,
  borderColor: '#8054B8',
  borderRadius: 20,
  paddingVertical: 9,
  paddingHorizontal: 22,
},

selectedMode: {
  backgroundColor: '#8054B8',
},

modeText: {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: 'bold',
  letterSpacing: 1.5,
},
  focusCircle: {
    width: 340,
    height: 340,
    borderRadius: 170,
    borderWidth: 2,
    borderColor: '#8054B8',
    backgroundColor: '#100D1C',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    shadowColor: '#9D5CFF',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 10,
  },
  petName: {
    color: '#FFB45C',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 5,
  },
  catContainer: {
    marginVertical: 10,
  },
  timerTitle: {
    color: '#B8A4D8',
    fontSize: 12,
    letterSpacing: 2,
    marginTop: 5,
  },
  timer: {
    color: '#FFFFFF',
    fontSize: 55,
    fontWeight: 'bold',
    marginVertical: 5,
    fontVariant: ['tabular-nums'],
  },
  startButton: {
    backgroundColor: '#C69AF0',
    paddingVertical: 9,
    paddingHorizontal: 28,
    borderRadius: 20,
    marginTop: 5,
  },
  buttonText: {
    color: '#21152F',
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: 14,
  },
  resetText: {
    color: '#B8A4D8',
    marginTop: 7,
    fontSize: 11,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 9,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#151020',
    borderWidth: 1,
    borderColor: '#49345F',
    borderRadius: 13,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statNumber: {
    color: '#E3C7FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#9688B0',
    fontSize: 9,
    marginTop: 6,
    letterSpacing: 1,
  },
  footer: {
    color: '#76678F',
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: 2,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
justifyContent: 'flex-start',
paddingTop: 250,  alignItems: 'center',
  padding: 20,
},

todoBox: {
  width: '100%',
  height: '75%',
  backgroundColor: '#100D1C',
  borderWidth: 2,
  borderColor: '#8054B8',
  borderRadius: 24,
  padding: 20,
  overflow: 'hidden',
},

todoHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
},

todoTitle: {
  color: '#D8B8FF',
  fontSize: 18,
  fontWeight: 'bold',
  letterSpacing: 2,
},

closeButton: {
  color: '#B8A4D8',
  fontSize: 22,
  padding: 5,
},

todoInput: {
  backgroundColor: '#1B1629',
  borderWidth: 1,
  borderColor: '#49345F',
  borderRadius: 12,
  padding: 12,
  color: '#FFFFFF',
  marginBottom: 12,
},

addButton: {
  backgroundColor: '#8054B8',
  padding: 12,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 15,
},

addButtonText: {
  color: '#FFFFFF',
  fontWeight: 'bold',
  letterSpacing: 1,
},

taskList: {
  flex: 1,
  minHeight: 0,
  width: '100%',
},

taskRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#30243F',
},

taskCheck: {
  color: '#C69AF0',
  fontSize: 22,
  marginRight: 12,
},

taskText: {
  color: '#FFFFFF',
  fontSize: 14,
  flex: 1,
},

completedTask: {
  color: '#8980A8',
  textDecorationLine: 'line-through',
},

clearButton: {
  marginTop: 15,
  padding: 10,
  alignItems: 'center',
},

clearButtonText: {
  color: '#B8A4D8',
  fontSize: 11,
  letterSpacing: 1,
  fontWeight: 'bold',
},
});

