import 'package:Fulminare/src/widgets/liquid-pages.dart';
import 'package:flutter/material.dart';
import 'package:liquid_swipe/liquid_swipe.dart';

void main() => runApp(const Fulminare());

class Fulminare extends StatefulWidget {
  const Fulminare({Key? key}) : super(key: key);

  @override
  _FulminareState createState() => _FulminareState();
}

class _FulminareState extends State<Fulminare> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Builder(
          builder: (context) => LiquidSwipe(
            pages: liquidPages,
            fullTransitionValue: 1100,
            enableLoop: true,
            ignoreUserGestureWhileAnimating: true,
            slideIconWidget: const Icon(Icons.arrow_back_ios),
            enableSideReveal: true,
            waveType: WaveType.liquidReveal,
          )),
    );
  }
}
