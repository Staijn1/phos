import 'package:Fulminare/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hsvcolor_picker/flutter_hsvcolor_picker.dart';

import '../../styles/styles.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.redAccent,
      body: SafeArea(
          child: Padding(
        padding: const EdgeInsets.all(30),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Text(
                'Choose your theme:',
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  /// //////////////////////////////////////////////////////
                  /// Change theme & rebuild to show it using these buttons
                  ElevatedButton(
                      onPressed: () => Fulminare.of(context)?.changeTheme(ThemeMode.light),
                      child: Text('Light')),
                  ElevatedButton(
                      onPressed: () => Fulminare.of(context)?.changeTheme(ThemeMode.dark),
                      child: Text('Dark')),
                  /// //////////////////////////////////////////////////////
                ],
              ),
            ],
          ),
        ),
      )),
    );
  }
}

extension HexColor on Color {
  /// Prefixes a hash sign if [leadingHashSign] is set to `true` (default is `true`).
  String toHex({bool leadingHashSign = true}) => '${leadingHashSign ? '#' : ''}'
      '${red.toRadixString(16).padLeft(2, '0')}'
      '${green.toRadixString(16).padLeft(2, '0')}'
      '${blue.toRadixString(16).padLeft(2, '0')}';
}
