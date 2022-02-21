import 'package:Fulminare/src/pages/home.dart';
import 'package:Fulminare/src/widgets/liquid-pages.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hsvcolor_picker/flutter_hsvcolor_picker.dart';
import 'package:liquid_swipe/liquid_swipe.dart';

void main() => runApp(const Fulminare());

class Fulminare extends StatefulWidget {
  const Fulminare({Key? key}) : super(key: key);

  @override
  _FulminareState createState() => _FulminareState();

  static _FulminareState? of(BuildContext context) =>
      context.findAncestorStateOfType<_FulminareState>();
}

class _FulminareState extends State<Fulminare> {
  int _selectedIndex = 0;
  ThemeMode _themeMode = ThemeMode.system;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        theme: ThemeData(),
        darkTheme: ThemeData.dark(), // standard dark theme
        themeMode: _themeMode,
        home: Scaffold(
          body: HomePage(),
          bottomNavigationBar: BottomNavigationBar(
            backgroundColor: Colors.black,
            type: BottomNavigationBarType.shifting,
            selectedFontSize: 20,
            selectedIconTheme: const IconThemeData(color: Colors.amber),
            selectedItemColor: Colors.amber,
            selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold),
            currentIndex: _selectedIndex,
            onTap: _onItemTapped,
            items: const <BottomNavigationBarItem>[
              BottomNavigationBarItem(
                icon: Icon(Icons.camera),
                label: 'Camera',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.camera),
                label: 'Second',
              ),
            ],
          ),
        ));
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  void changeTheme(ThemeMode themeMode) {
    setState(() {
      _themeMode = themeMode;
    });
  }
}
