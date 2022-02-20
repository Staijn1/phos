import 'package:Fulminare/src/widgets/liquid-pages.dart';
import 'package:flutter/material.dart';
import 'package:liquid_swipe/liquid_swipe.dart';

class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Builder(builder: (context) =>
          LiquidSwipe(
            pages: liquidPages,
            fullTransitionValue: 1000,
            enableLoop: true,
            slideIconWidget: Icon(Icons.arrow_back_ios),
            enableSideReveal: true,
            waveType: WaveType.liquidReveal
          )),
    );
  }
}
